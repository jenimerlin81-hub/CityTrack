export type UserRole = 'passenger' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
}

export interface BusStop {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  routes: string[]; // route IDs
  landmark?: string;
  zone?: string;
}

export interface RouteStopInfo {
  stopId: string;
  stopName: string;
  sequenceOrder: number;
  distanceFromStartKm: number;
  estimatedMinutesFromStart: number;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  color: string;
  stops: RouteStopInfo[];
  coordinates: [number, number][]; // [lat, lng] polyline
  fare: number;
  totalDistanceKm: number;
  averageTripMinutes: number;
  frequencyMinutes: number;
  firstBus: string;
  lastBus: string;
}

export interface Bus {
  id: string;
  busNumber: string;
  registrationNumber: string;
  driverId: string;
  driverName?: string;
  driverPhone?: string;
  routeId: string;
  routeNumber?: string;
  routeName?: string;
  latitude: number;
  longitude: number;
  heading: number; // 0-360 degrees
  speed: number; // km/h
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  occupancy: 'low' | 'medium' | 'high' | 'full';
  currentStopIndex: number;
  nextStopName: string;
  nextStopDistanceKm: number;
  nextStopEtaMinutes: number;
  destination: string;
  lastUpdated: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  assignedBusId?: string;
  assignedBusNumber?: string;
  assignedRouteId?: string;
  licenseNumber: string;
  status: 'on_duty' | 'off_duty' | 'on_trip';
  rating: number;
}

export interface Trip {
  id: string;
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  routeId: string;
  routeName: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  passengersCarried?: number;
  currentStop?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  busNumber?: string;
  routeNumber?: string;
  read?: boolean;
}

export interface ETAInfo {
  busId: string;
  busNumber: string;
  routeNumber: string;
  stopName: string;
  distanceKm: number;
  etaMinutes: number;
  estimatedArrival: string;
  speedKmH: number;
}
