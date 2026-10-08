import { Bus, BusRoute, BusStop, ETAInfo } from '../../src/types/index.ts';

/**
 * Calculates distance between two latitude/longitude points in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Calculates Estimated Arrival Time (minutes)
 * Distance / Speed (with traffic factor and minimum stop buffer)
 */
export function calculateEtaMinutes(distanceKm: number, speedKmH: number = 30): number {
  // If speed is very slow (traffic/stopped), assume minimum 15 km/h for calculation
  const effectiveSpeed = Math.max(speedKmH, 15);
  // Add 1 minute per kilometer for city traffic, signals, and passenger boarding
  const driveMinutes = (distanceKm / effectiveSpeed) * 60;
  const bufferMinutes = Math.max(1, distanceKm * 0.5);
  const totalMinutes = Math.ceil(driveMinutes + bufferMinutes);
  return Math.max(1, totalMinutes);
}

/**
 * Computes ETA for a bus reaching a target bus stop
 */
export function getBusStopEta(bus: Bus, stop: BusStop): ETAInfo {
  const distanceKm = calculateDistanceKm(
    bus.latitude,
    bus.longitude,
    stop.latitude,
    stop.longitude
  );

  const etaMinutes = calculateEtaMinutes(distanceKm, bus.speed);
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + etaMinutes * 60000);
  const formattedArrival = arrivalTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    busId: bus.id,
    busNumber: bus.busNumber,
    routeNumber: bus.routeNumber || '',
    stopName: stop.name,
    distanceKm,
    etaMinutes,
    estimatedArrival: formattedArrival,
    speedKmH: bus.speed
  };
}

/**
 * Finds all upcoming stops on the route for a given bus with ETAs
 */
export function getUpcomingStopsWithEta(
  bus: Bus,
  route: BusRoute,
  allStops: BusStop[]
): Array<{
  stopId: string;
  stopName: string;
  distanceKm: number;
  etaMinutes: number;
  arrivalTime: string;
  isNext: boolean;
}> {
  const routeStops = route.stops || [];
  const currentIdx = Math.min(bus.currentStopIndex, routeStops.length - 1);
  const upcoming = routeStops.slice(currentIdx);

  let cumulativeDistance = 0;
  let prevLat = bus.latitude;
  let prevLng = bus.longitude;

  return upcoming.map((rs, index) => {
    const stopObj = allStops.find(s => s.id === rs.stopId);
    const stopLat = stopObj ? stopObj.latitude : bus.latitude;
    const stopLng = stopObj ? stopObj.longitude : bus.longitude;

    const legDistance = calculateDistanceKm(prevLat, prevLng, stopLat, stopLng);
    cumulativeDistance += legDistance;
    prevLat = stopLat;
    prevLng = stopLng;

    const etaMinutes = calculateEtaMinutes(cumulativeDistance, bus.speed);
    const arrivalTime = new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      stopId: rs.stopId,
      stopName: rs.stopName,
      distanceKm: Number(cumulativeDistance.toFixed(2)),
      etaMinutes,
      arrivalTime,
      isNext: index === 0
    };
  });
}
