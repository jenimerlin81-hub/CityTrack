import {
  initialBuses,
  initialDrivers,
  initialRoutes,
  initialStops,
  initialUsers,
  initialTrips,
  initialNotifications
} from '../data/seedData.ts';
import { Bus, BusRoute, BusStop, Driver, Trip, User, SystemNotification } from '../../src/types/index.ts';

// In-Memory Database store with optional MongoDB adapter support
class DatabaseStore {
  private buses: Bus[] = [];
  private routes: BusRoute[] = [];
  private stops: BusStop[] = [];
  private drivers: Driver[] = [];
  private users: (User & { passwordHash?: string })[] = [];
  private trips: Trip[] = [];
  private notifications: SystemNotification[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    this.buses = JSON.parse(JSON.stringify(initialBuses));
    this.routes = JSON.parse(JSON.stringify(initialRoutes));
    this.stops = JSON.parse(JSON.stringify(initialStops));
    this.drivers = JSON.parse(JSON.stringify(initialDrivers));
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.trips = JSON.parse(JSON.stringify(initialTrips));
    this.notifications = JSON.parse(JSON.stringify(initialNotifications));
  }

  // BUSES
  public getBuses(): Bus[] {
    return this.buses;
  }

  public getBusById(id: string): Bus | undefined {
    return this.buses.find(b => b.id === id || b.busNumber === id);
  }

  public createBus(busData: Partial<Bus>): Bus {
    const newBus: Bus = {
      id: busData.id || `bus-${Date.now()}`,
      busNumber: busData.busNumber || 'NewBus',
      registrationNumber: busData.registrationNumber || `TN-45-XX-${Math.floor(1000 + Math.random() * 9000)}`,
      driverId: busData.driverId || '',
      driverName: busData.driverName || 'Unassigned',
      driverPhone: busData.driverPhone || '',
      routeId: busData.routeId || '',
      routeNumber: busData.routeNumber || '',
      routeName: busData.routeName || '',
      latitude: busData.latitude || 10.7981,
      longitude: busData.longitude || 78.6835,
      heading: busData.heading || 0,
      speed: busData.speed ?? 30,
      status: busData.status || 'active',
      occupancy: busData.occupancy || 'medium',
      currentStopIndex: busData.currentStopIndex || 0,
      nextStopName: busData.nextStopName || 'Next Stop',
      nextStopDistanceKm: busData.nextStopDistanceKm || 1.5,
      nextStopEtaMinutes: busData.nextStopEtaMinutes || 4,
      destination: busData.destination || 'Destination',
      lastUpdated: new Date().toISOString()
    };
    this.buses.push(newBus);
    return newBus;
  }

  public updateBus(id: string, updates: Partial<Bus>): Bus | null {
    const index = this.buses.findIndex(b => b.id === id || b.busNumber === id);
    if (index === -1) return null;
    this.buses[index] = {
      ...this.buses[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    return this.buses[index];
  }

  public deleteBus(id: string): boolean {
    const prevLen = this.buses.length;
    this.buses = this.buses.filter(b => b.id !== id && b.busNumber !== id);
    return this.buses.length < prevLen;
  }

  // ROUTES
  public getRoutes(): BusRoute[] {
    return this.routes;
  }

  public getRouteById(id: string): BusRoute | undefined {
    return this.routes.find(r => r.id === id || r.routeNumber === id);
  }

  public createRoute(routeData: Partial<BusRoute>): BusRoute {
    const newRoute: BusRoute = {
      id: routeData.id || `route-${Date.now()}`,
      routeNumber: routeData.routeNumber || `${100 + this.routes.length}`,
      routeName: routeData.routeName || 'City Line',
      startPoint: routeData.startPoint || 'Origin',
      endPoint: routeData.endPoint || 'Destination',
      color: routeData.color || '#3B82F6',
      fare: routeData.fare || 15,
      totalDistanceKm: routeData.totalDistanceKm || 10,
      averageTripMinutes: routeData.averageTripMinutes || 25,
      frequencyMinutes: routeData.frequencyMinutes || 15,
      firstBus: routeData.firstBus || '06:00 AM',
      lastBus: routeData.lastBus || '10:00 PM',
      stops: routeData.stops || [],
      coordinates: routeData.coordinates || [
        [10.7981, 78.6835],
        [10.8340, 78.6945]
      ]
    };
    this.routes.push(newRoute);
    return newRoute;
  }

  public updateRoute(id: string, updates: Partial<BusRoute>): BusRoute | null {
    const index = this.routes.findIndex(r => r.id === id || r.routeNumber === id);
    if (index === -1) return null;
    this.routes[index] = { ...this.routes[index], ...updates };
    return this.routes[index];
  }

  public deleteRoute(id: string): boolean {
    const prevLen = this.routes.length;
    this.routes = this.routes.filter(r => r.id !== id && r.routeNumber !== id);
    return this.routes.length < prevLen;
  }

  // STOPS
  public getStops(): BusStop[] {
    return this.stops;
  }

  public getStopById(id: string): BusStop | undefined {
    return this.stops.find(s => s.id === id || s.code === id);
  }

  public createStop(stopData: Partial<BusStop>): BusStop {
    const newStop: BusStop = {
      id: stopData.id || `stop-${Date.now()}`,
      name: stopData.name || 'New Stop',
      code: stopData.code || `STP-${this.stops.length + 1}`,
      latitude: stopData.latitude || 10.8000,
      longitude: stopData.longitude || 78.6900,
      routes: stopData.routes || [],
      landmark: stopData.landmark || '',
      zone: stopData.zone || 'Central'
    };
    this.stops.push(newStop);
    return newStop;
  }

  // DRIVERS
  public getDrivers(): Driver[] {
    return this.drivers;
  }

  public getDriverById(id: string): Driver | undefined {
    return this.drivers.find(d => d.id === id || d.email === id);
  }

  public createDriver(driverData: Partial<Driver>): Driver {
    const newDriver: Driver = {
      id: driverData.id || `driver-${Date.now()}`,
      name: driverData.name || 'New Driver',
      phone: driverData.phone || '+91 90000 00000',
      email: driverData.email || `driver${Date.now()}@citytrack.in`,
      licenseNumber: driverData.licenseNumber || `TN-45-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      assignedBusId: driverData.assignedBusId,
      assignedBusNumber: driverData.assignedBusNumber,
      assignedRouteId: driverData.assignedRouteId,
      status: driverData.status || 'on_duty',
      rating: driverData.rating || 4.8
    };
    this.drivers.push(newDriver);
    return newDriver;
  }

  public updateDriver(id: string, updates: Partial<Driver>): Driver | null {
    const index = this.drivers.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.drivers[index] = { ...this.drivers[index], ...updates };
    return this.drivers[index];
  }

  public deleteDriver(id: string): boolean {
    const prev = this.drivers.length;
    this.drivers = this.drivers.filter(d => d.id !== id);
    return this.drivers.length < prev;
  }

  // USERS & AUTH
  public getUsers(): (User & { passwordHash?: string })[] {
    return this.users;
  }

  public getUserByEmail(email: string): (User & { passwordHash?: string }) | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): (User & { passwordHash?: string }) | undefined {
    return this.users.find(u => u.id === id);
  }

  public createUser(userData: { name: string; email: string; phone?: string; password: string; role?: 'passenger' | 'driver' | 'admin' }): User {
    const newUser: User & { passwordHash?: string } = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone || '+91 98000 00000',
      role: userData.role || 'passenger',
      passwordHash: userData.password,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  // TRIPS
  public getTrips(): Trip[] {
    return this.trips;
  }

  public createTrip(tripData: Partial<Trip>): Trip {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      busId: tripData.busId || '',
      busNumber: tripData.busNumber || '',
      driverId: tripData.driverId || '',
      driverName: tripData.driverName || '',
      routeId: tripData.routeId || '',
      routeName: tripData.routeName || '',
      startTime: new Date().toISOString(),
      status: 'in_progress',
      passengersCarried: tripData.passengersCarried || 0,
      currentStop: tripData.currentStop || ''
    };
    this.trips.unshift(newTrip);
    return newTrip;
  }

  public endTrip(tripId: string): Trip | null {
    const trip = this.trips.find(t => t.id === tripId || (t.busId === tripId && t.status === 'in_progress'));
    if (!trip) return null;
    trip.status = 'completed';
    trip.endTime = new Date().toISOString();
    return trip;
  }

  // NOTIFICATIONS
  public getNotifications(): SystemNotification[] {
    return this.notifications;
  }

  public addNotification(notification: Omit<SystemNotification, 'id' | 'timestamp'>): SystemNotification {
    const newNotif: SystemNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    // keep max 50
    if (this.notifications.length > 50) {
      this.notifications.pop();
    }
    return newNotif;
  }

  // STATS
  public getStats() {
    const activeBuses = this.buses.filter(b => b.status === 'active').length;
    const activeTrips = this.trips.filter(t => t.status === 'in_progress').length;
    return {
      totalBuses: this.buses.length,
      activeBuses,
      totalDrivers: this.drivers.length,
      totalRoutes: this.routes.length,
      totalStops: this.stops.length,
      totalPassengers: this.users.filter(u => u.role === 'passenger').length,
      activeTrips
    };
  }
}

export const db = new DatabaseStore();
