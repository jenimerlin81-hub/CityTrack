import { Server as SocketServer } from 'socket.io';
import { db } from '../store/db.ts';
import { calculateDistanceKm, calculateEtaMinutes } from './etaService.ts';
import { Bus, BusRoute } from '../../src/types/index.ts';

// Calculate bearing/heading in degrees between two coordinates
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

class SimulationService {
  private io: SocketServer | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = true;
  private speedMultiplier: number = 1.0;
  // Progress tracker for each bus: { busId: { waypointIndex: number, progressFraction: number, direction: 1 | -1 } }
  private progressMap: Map<string, { waypointIndex: number; progressFraction: number; direction: number }> = new Map();

  public init(io: SocketServer) {
    this.io = io;
    this.initBusProgress();
    this.start();
  }

  private initBusProgress() {
    const buses = db.getBuses();
    buses.forEach((bus, i) => {
      this.progressMap.set(bus.id, {
        waypointIndex: (i * 2) % 6,
        progressFraction: (i * 0.2) % 1,
        direction: 1
      });
    });
  }

  public setSpeed(multiplier: number) {
    this.speedMultiplier = Math.max(0.2, Math.min(multiplier, 10));
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  public isSimulationActive(): boolean {
    return this.isRunning;
  }

  public start() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isRunning = true;

    // Run simulation loop every 2.5 seconds
    this.intervalId = setInterval(() => {
      this.tick();
    }, 2500);
  }

  public pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  public resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  private tick() {
    const buses = db.getBuses();
    const routes = db.getRoutes();
    const allStops = db.getStops();

    buses.forEach(bus => {
      if (bus.status !== 'active') return;

      const route = routes.find(r => r.id === bus.routeId || r.routeNumber === bus.routeNumber);
      if (!route || !route.coordinates || route.coordinates.length < 2) return;

      let progress = this.progressMap.get(bus.id);
      if (!progress) {
        progress = { waypointIndex: 0, progressFraction: 0, direction: 1 };
        this.progressMap.set(bus.id, progress);
      }

      // Increment progress along segment
      // Step fraction proportional to speedMultiplier
      const step = 0.08 * this.speedMultiplier;
      progress.progressFraction += step;

      const coords = route.coordinates;
      let currIdx = progress.waypointIndex;
      let nextIdx = currIdx + progress.direction;

      // Handle endpoints of the route polyline (reversing direction)
      if (nextIdx >= coords.length) {
        progress.direction = -1;
        progress.waypointIndex = coords.length - 1;
        currIdx = coords.length - 1;
        nextIdx = coords.length - 2;
        progress.progressFraction = 0;
      } else if (nextIdx < 0) {
        progress.direction = 1;
        progress.waypointIndex = 0;
        currIdx = 0;
        nextIdx = 1;
        progress.progressFraction = 0;
      }

      if (progress.progressFraction >= 1.0) {
        progress.waypointIndex = nextIdx;
        progress.progressFraction = 0;
        currIdx = nextIdx;
        nextIdx = currIdx + progress.direction;
        if (nextIdx >= coords.length || nextIdx < 0) {
          progress.direction *= -1;
          nextIdx = currIdx + progress.direction;
        }
      }

      const p1 = coords[currIdx];
      const p2 = coords[nextIdx] || p1;

      // Linear interpolation between waypoints
      const frac = progress.progressFraction;
      const currentLat = Number((p1[0] + (p2[0] - p1[0]) * frac).toFixed(6));
      const currentLng = Number((p1[1] + (p2[1] - p1[1]) * frac).toFixed(6));
      const heading = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

      // Dynamic realistic speed between 25 and 48 km/h with subtle variance
      const speed = Math.round(28 + Math.sin(Date.now() / 10000 + currIdx) * 12);

      // Determine next bus stop along the route
      let nextStopName = bus.nextStopName;
      let nextStopDistanceKm = bus.nextStopDistanceKm;
      let nextStopEtaMinutes = bus.nextStopEtaMinutes;

      if (route.stops && route.stops.length > 0) {
        // Find closest stop that is ahead
        let minDistance = Infinity;
        let bestStop = route.stops[0];
        let bestStopObj = allStops.find(s => s.id === bestStop.stopId);

        for (const rs of route.stops) {
          const sObj = allStops.find(s => s.id === rs.stopId);
          if (sObj) {
            const dist = calculateDistanceKm(currentLat, currentLng, sObj.latitude, sObj.longitude);
            if (dist < minDistance && dist > 0.05) {
              minDistance = dist;
              bestStop = rs;
              bestStopObj = sObj;
            }
          }
        }

        if (bestStopObj) {
          nextStopName = bestStopObj.name;
          nextStopDistanceKm = Number(minDistance.toFixed(2));
          nextStopEtaMinutes = calculateEtaMinutes(nextStopDistanceKm, speed);
        }
      }

      // Update bus state in database
      const updatedBus = db.updateBus(bus.id, {
        latitude: currentLat,
        longitude: currentLng,
        heading,
        speed,
        nextStopName,
        nextStopDistanceKm,
        nextStopEtaMinutes
      });

      // Emit real-time WebSocket update
      if (this.io && updatedBus) {
        this.io.emit('busLocationUpdate', {
          busId: updatedBus.id,
          busNumber: updatedBus.busNumber,
          routeNumber: updatedBus.routeNumber,
          latitude: updatedBus.latitude,
          longitude: updatedBus.longitude,
          heading: updatedBus.heading,
          speed: updatedBus.speed,
          status: updatedBus.status,
          nextStopName: updatedBus.nextStopName,
          nextStopDistanceKm: updatedBus.nextStopDistanceKm,
          nextStopEtaMinutes: updatedBus.nextStopEtaMinutes,
          lastUpdated: updatedBus.lastUpdated
        });
      }
    });
  }

  // Allow manual driver GPS broadcast from Driver Panel
  public handleManualDriverUpdate(busId: string, latitude: number, longitude: number, speed: number = 30) {
    const bus = db.getBusById(busId);
    if (!bus) return null;

    const heading = calculateBearing(bus.latitude, bus.longitude, latitude, longitude);
    const updated = db.updateBus(bus.id, {
      latitude,
      longitude,
      speed,
      heading: heading || bus.heading
    });

    if (this.io && updated) {
      this.io.emit('busLocationUpdate', updated);
    }
    return updated;
  }
}

export const simulationService = new SimulationService();
