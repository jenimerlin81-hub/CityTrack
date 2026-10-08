import { BusStop, BusRoute, Bus, Driver, User, Trip, SystemNotification } from '../../src/types/index.ts';

// 20 realistic bus stops in a small city (Trichy region)
export const initialStops: BusStop[] = [
  {
    id: 'stop-1',
    name: 'Central Bus Stand',
    code: 'CBS-01',
    latitude: 10.7981,
    longitude: 78.6835,
    routes: ['route-1', 'route-3', 'route-4'],
    landmark: 'Opposite State Transport Office',
    zone: 'Central'
  },
  {
    id: 'stop-2',
    name: 'Tiruchirappalli Railway Junction',
    code: 'TPJ-02',
    latitude: 10.7915,
    longitude: 78.6848,
    routes: ['route-1', 'route-2', 'route-3'],
    landmark: 'Railway Station Main Entrance',
    zone: 'Junction'
  },
  {
    id: 'stop-3',
    name: 'Palakkarai Roundabout',
    code: 'PLK-03',
    latitude: 10.8062,
    longitude: 78.6920,
    routes: ['route-1', 'route-2'],
    landmark: 'Near Roman Catholic Church',
    zone: 'East'
  },
  {
    id: 'stop-4',
    name: 'Gandhi Market',
    code: 'GDM-04',
    latitude: 10.8175,
    longitude: 78.6968,
    routes: ['route-1', 'route-2', 'route-5'],
    landmark: 'Clock Tower Junction',
    zone: 'Old Town'
  },
  {
    id: 'stop-5',
    name: 'Rockfort Uchi Pillayar',
    code: 'RKF-05',
    latitude: 10.8272,
    longitude: 78.6975,
    routes: ['route-1', 'route-5'],
    landmark: 'Teppakulam Water Tank',
    zone: 'Heritage'
  },
  {
    id: 'stop-6',
    name: 'Chathiram Bus Stand',
    code: 'CHB-06',
    latitude: 10.8340,
    longitude: 78.6945,
    routes: ['route-1', 'route-3', 'route-5'],
    landmark: 'North Hub Terminus',
    zone: 'North'
  },
  {
    id: 'stop-7',
    name: 'Mambazhasalai Bridge',
    code: 'MBS-07',
    latitude: 10.8445,
    longitude: 78.6980,
    routes: ['route-1', 'route-5'],
    landmark: 'Cauvery River Viewpoint',
    zone: 'Cauvery River'
  },
  {
    id: 'stop-8',
    name: 'Amma Mandapam Ghat',
    code: 'AMM-08',
    latitude: 10.8520,
    longitude: 78.6952,
    routes: ['route-1'],
    landmark: 'Cauvery Bathing Ghats',
    zone: 'Riverbank'
  },
  {
    id: 'stop-9',
    name: 'Srirangam Rajagopuram',
    code: 'SRG-09',
    latitude: 10.8622,
    longitude: 78.6918,
    routes: ['route-1'],
    landmark: 'Grand South Temple Tower',
    zone: 'Temple City'
  },
  {
    id: 'stop-10',
    name: 'Thillai Nagar Main Cross',
    code: 'TLN-10',
    latitude: 10.8125,
    longitude: 78.6795,
    routes: ['route-3', 'route-5'],
    landmark: 'Shopping Street 11th Cross',
    zone: 'West'
  },
  {
    id: 'stop-11',
    name: 'KMC Speciality Hospital',
    code: 'KMC-11',
    latitude: 10.8190,
    longitude: 78.6750,
    routes: ['route-3', 'route-5'],
    landmark: 'Emergency Gate & Trauma Centre',
    zone: 'West'
  },
  {
    id: 'stop-12',
    name: 'Bishop Heber College',
    code: 'BHC-12',
    latitude: 10.8260,
    longitude: 78.6690,
    routes: ['route-3'],
    landmark: 'College Arch Campus',
    zone: 'Vayalur Road'
  },
  {
    id: 'stop-13',
    name: 'Anna Stadium Sports Complex',
    code: 'ANS-13',
    latitude: 10.7930,
    longitude: 78.6710,
    routes: ['route-4'],
    landmark: 'Athletic Track Gate',
    zone: 'Khajamalai'
  },
  {
    id: 'stop-14',
    name: 'K.K. Nagar Terminus',
    code: 'KKN-14',
    latitude: 10.7760,
    longitude: 78.6890,
    routes: ['route-3', 'route-4'],
    landmark: 'Sundar Nagar Junction',
    zone: 'South'
  },
  {
    id: 'stop-15',
    name: 'Tiruchirappalli International Airport',
    code: 'TRZ-15',
    latitude: 10.7650,
    longitude: 78.7095,
    routes: ['route-3'],
    landmark: 'Departures / Cargo Entry',
    zone: 'Airport'
  },
  {
    id: 'stop-16',
    name: 'TVS Tollgate',
    code: 'TVS-16',
    latitude: 10.7890,
    longitude: 78.7040,
    routes: ['route-2', 'route-4'],
    landmark: 'NH-45 Highway Junction',
    zone: 'Industrial South'
  },
  {
    id: 'stop-17',
    name: 'Ponmalai Golden Rock Workshop',
    code: 'GLR-17',
    latitude: 10.7820,
    longitude: 78.7210,
    routes: ['route-2', 'route-4'],
    landmark: 'Locomotive Railway Workshop',
    zone: 'Railway Colony'
  },
  {
    id: 'stop-18',
    name: 'BHEL Township Kailasapuram',
    code: 'BHL-18',
    latitude: 10.7680,
    longitude: 78.7750,
    routes: ['route-2', 'route-4'],
    landmark: 'BHEL Hospital & Club',
    zone: 'Township'
  },
  {
    id: 'stop-19',
    name: 'NIT Trichy Campus Gate',
    code: 'NIT-19',
    latitude: 10.7610,
    longitude: 78.8140,
    routes: ['route-2'],
    landmark: 'National Institute of Tech Main Gate',
    zone: 'Thuvakudi'
  },
  {
    id: 'stop-20',
    name: 'Samayapuram Toll Plaza',
    code: 'SMP-20',
    latitude: 10.9080,
    longitude: 78.7280,
    routes: ['route-5'],
    landmark: 'Mariamman Temple Highway Bypass',
    zone: 'North Outer'
  }
];

// 5 well-defined small-city routes with waypoints
export const initialRoutes: BusRoute[] = [
  {
    id: 'route-1',
    routeNumber: '101',
    routeName: 'Central Bus Stand ⇄ Srirangam Temple',
    startPoint: 'Central Bus Stand',
    endPoint: 'Srirangam Rajagopuram',
    color: '#06B6D4', // cyan-500
    fare: 15,
    totalDistanceKm: 8.5,
    averageTripMinutes: 28,
    frequencyMinutes: 10,
    firstBus: '05:00 AM',
    lastBus: '11:00 PM',
    stops: [
      { stopId: 'stop-1', stopName: 'Central Bus Stand', sequenceOrder: 1, distanceFromStartKm: 0.0, estimatedMinutesFromStart: 0 },
      { stopId: 'stop-2', stopName: 'Tiruchirappalli Railway Junction', sequenceOrder: 2, distanceFromStartKm: 1.2, estimatedMinutesFromStart: 4 },
      { stopId: 'stop-3', stopName: 'Palakkarai Roundabout', sequenceOrder: 3, distanceFromStartKm: 2.8, estimatedMinutesFromStart: 9 },
      { stopId: 'stop-4', stopName: 'Gandhi Market', sequenceOrder: 4, distanceFromStartKm: 4.1, estimatedMinutesFromStart: 14 },
      { stopId: 'stop-5', stopName: 'Rockfort Uchi Pillayar', sequenceOrder: 5, distanceFromStartKm: 5.3, estimatedMinutesFromStart: 18 },
      { stopId: 'stop-6', stopName: 'Chathiram Bus Stand', sequenceOrder: 6, distanceFromStartKm: 6.2, estimatedMinutesFromStart: 21 },
      { stopId: 'stop-7', stopName: 'Mambazhasalai Bridge', sequenceOrder: 7, distanceFromStartKm: 7.1, estimatedMinutesFromStart: 24 },
      { stopId: 'stop-8', stopName: 'Amma Mandapam Ghat', sequenceOrder: 8, distanceFromStartKm: 7.9, estimatedMinutesFromStart: 26 },
      { stopId: 'stop-9', stopName: 'Srirangam Rajagopuram', sequenceOrder: 9, distanceFromStartKm: 8.5, estimatedMinutesFromStart: 28 }
    ],
    coordinates: [
      [10.7981, 78.6835],
      [10.7950, 78.6840],
      [10.7915, 78.6848],
      [10.7980, 78.6880],
      [10.8062, 78.6920],
      [10.8115, 78.6945],
      [10.8175, 78.6968],
      [10.8220, 78.6970],
      [10.8272, 78.6975],
      [10.8310, 78.6960],
      [10.8340, 78.6945],
      [10.8390, 78.6960],
      [10.8445, 78.6980],
      [10.8520, 78.6952],
      [10.8570, 78.6935],
      [10.8622, 78.6918]
    ]
  },
  {
    id: 'route-2',
    routeNumber: '102',
    routeName: 'Railway Junction ⇄ NIT Trichy Campus',
    startPoint: 'Railway Junction',
    endPoint: 'NIT Trichy Campus Gate',
    color: '#3B82F6', // blue-500
    fare: 25,
    totalDistanceKm: 18.2,
    averageTripMinutes: 42,
    frequencyMinutes: 15,
    firstBus: '05:30 AM',
    lastBus: '10:30 PM',
    stops: [
      { stopId: 'stop-2', stopName: 'Tiruchirappalli Railway Junction', sequenceOrder: 1, distanceFromStartKm: 0.0, estimatedMinutesFromStart: 0 },
      { stopId: 'stop-3', stopName: 'Palakkarai Roundabout', sequenceOrder: 2, distanceFromStartKm: 1.6, estimatedMinutesFromStart: 5 },
      { stopId: 'stop-4', stopName: 'Gandhi Market', sequenceOrder: 3, distanceFromStartKm: 3.2, estimatedMinutesFromStart: 10 },
      { stopId: 'stop-16', stopName: 'TVS Tollgate', sequenceOrder: 4, distanceFromStartKm: 5.8, estimatedMinutesFromStart: 16 },
      { stopId: 'stop-17', stopName: 'Ponmalai Golden Rock Workshop', sequenceOrder: 5, distanceFromStartKm: 8.4, estimatedMinutesFromStart: 22 },
      { stopId: 'stop-18', stopName: 'BHEL Township Kailasapuram', sequenceOrder: 6, distanceFromStartKm: 13.5, estimatedMinutesFromStart: 32 },
      { stopId: 'stop-19', stopName: 'NIT Trichy Campus Gate', sequenceOrder: 7, distanceFromStartKm: 18.2, estimatedMinutesFromStart: 42 }
    ],
    coordinates: [
      [10.7915, 78.6848],
      [10.7980, 78.6880],
      [10.8062, 78.6920],
      [10.8175, 78.6968],
      [10.8050, 78.7010],
      [10.7890, 78.7040],
      [10.7820, 78.7210],
      [10.7780, 78.7450],
      [10.7680, 78.7750],
      [10.7640, 78.7950],
      [10.7610, 78.8140]
    ]
  },
  {
    id: 'route-3',
    routeNumber: '204',
    routeName: 'Chathiram Bus Stand ⇄ Airport via K.K. Nagar',
    startPoint: 'Chathiram Bus Stand',
    endPoint: 'Tiruchirappalli International Airport',
    color: '#10B981', // emerald-500
    fare: 20,
    totalDistanceKm: 12.8,
    averageTripMinutes: 35,
    frequencyMinutes: 12,
    firstBus: '05:00 AM',
    lastBus: '11:45 PM',
    stops: [
      { stopId: 'stop-6', stopName: 'Chathiram Bus Stand', sequenceOrder: 1, distanceFromStartKm: 0.0, estimatedMinutesFromStart: 0 },
      { stopId: 'stop-10', stopName: 'Thillai Nagar Main Cross', sequenceOrder: 2, distanceFromStartKm: 2.2, estimatedMinutesFromStart: 7 },
      { stopId: 'stop-11', stopName: 'KMC Speciality Hospital', sequenceOrder: 3, distanceFromStartKm: 3.4, estimatedMinutesFromStart: 11 },
      { stopId: 'stop-12', stopName: 'Bishop Heber College', sequenceOrder: 4, distanceFromStartKm: 4.8, estimatedMinutesFromStart: 15 },
      { stopId: 'stop-1', stopName: 'Central Bus Stand', sequenceOrder: 5, distanceFromStartKm: 7.2, estimatedMinutesFromStart: 21 },
      { stopId: 'stop-14', stopName: 'K.K. Nagar Terminus', sequenceOrder: 6, distanceFromStartKm: 9.8, estimatedMinutesFromStart: 28 },
      { stopId: 'stop-15', stopName: 'Tiruchirappalli International Airport', sequenceOrder: 7, distanceFromStartKm: 12.8, estimatedMinutesFromStart: 35 }
    ],
    coordinates: [
      [10.8340, 78.6945],
      [10.8250, 78.6870],
      [10.8125, 78.6795],
      [10.8190, 78.6750],
      [10.8260, 78.6690],
      [10.8100, 78.6740],
      [10.7981, 78.6835],
      [10.7850, 78.6860],
      [10.7760, 78.6890],
      [10.7700, 78.6980],
      [10.7650, 78.7095]
    ]
  },
  {
    id: 'route-4',
    routeNumber: '305',
    routeName: 'Central Bus Stand ⇄ BHEL Township via Golden Rock',
    startPoint: 'Central Bus Stand',
    endPoint: 'BHEL Township Kailasapuram',
    color: '#8B5CF6', // purple-500
    fare: 18,
    totalDistanceKm: 11.4,
    averageTripMinutes: 30,
    frequencyMinutes: 20,
    firstBus: '06:00 AM',
    lastBus: '10:00 PM',
    stops: [
      { stopId: 'stop-1', stopName: 'Central Bus Stand', sequenceOrder: 1, distanceFromStartKm: 0.0, estimatedMinutesFromStart: 0 },
      { stopId: 'stop-13', stopName: 'Anna Stadium Sports Complex', sequenceOrder: 2, distanceFromStartKm: 1.5, estimatedMinutesFromStart: 5 },
      { stopId: 'stop-14', stopName: 'K.K. Nagar Terminus', sequenceOrder: 3, distanceFromStartKm: 3.5, estimatedMinutesFromStart: 10 },
      { stopId: 'stop-16', stopName: 'TVS Tollgate', sequenceOrder: 4, distanceFromStartKm: 5.2, estimatedMinutesFromStart: 15 },
      { stopId: 'stop-17', stopName: 'Ponmalai Golden Rock Workshop', sequenceOrder: 5, distanceFromStartKm: 7.1, estimatedMinutesFromStart: 20 },
      { stopId: 'stop-18', stopName: 'BHEL Township Kailasapuram', sequenceOrder: 6, distanceFromStartKm: 11.4, estimatedMinutesFromStart: 30 }
    ],
    coordinates: [
      [10.7981, 78.6835],
      [10.7930, 78.6710],
      [10.7820, 78.6780],
      [10.7760, 78.6890],
      [10.7890, 78.7040],
      [10.7820, 78.7210],
      [10.7750, 78.7480],
      [10.7680, 78.7750]
    ]
  },
  {
    id: 'route-5',
    routeNumber: '408',
    routeName: 'Heritage Express: Rockfort ⇄ Samayapuram',
    startPoint: 'Rockfort Uchi Pillayar',
    endPoint: 'Samayapuram Toll Plaza',
    color: '#F59E0B', // amber-500
    fare: 22,
    totalDistanceKm: 14.0,
    averageTripMinutes: 36,
    frequencyMinutes: 15,
    firstBus: '05:30 AM',
    lastBus: '10:30 PM',
    stops: [
      { stopId: 'stop-5', stopName: 'Rockfort Uchi Pillayar', sequenceOrder: 1, distanceFromStartKm: 0.0, estimatedMinutesFromStart: 0 },
      { stopId: 'stop-4', stopName: 'Gandhi Market', sequenceOrder: 2, distanceFromStartKm: 1.4, estimatedMinutesFromStart: 5 },
      { stopId: 'stop-10', stopName: 'Thillai Nagar Main Cross', sequenceOrder: 3, distanceFromStartKm: 3.1, estimatedMinutesFromStart: 10 },
      { stopId: 'stop-11', stopName: 'KMC Speciality Hospital', sequenceOrder: 4, distanceFromStartKm: 4.2, estimatedMinutesFromStart: 13 },
      { stopId: 'stop-6', stopName: 'Chathiram Bus Stand', sequenceOrder: 5, distanceFromStartKm: 5.8, estimatedMinutesFromStart: 18 },
      { stopId: 'stop-7', stopName: 'Mambazhasalai Bridge', sequenceOrder: 6, distanceFromStartKm: 7.2, estimatedMinutesFromStart: 22 },
      { stopId: 'stop-20', stopName: 'Samayapuram Toll Plaza', sequenceOrder: 7, distanceFromStartKm: 14.0, estimatedMinutesFromStart: 36 }
    ],
    coordinates: [
      [10.8272, 78.6975],
      [10.8175, 78.6968],
      [10.8125, 78.6795],
      [10.8190, 78.6750],
      [10.8340, 78.6945],
      [10.8445, 78.6980],
      [10.8650, 78.7100],
      [10.8850, 78.7200],
      [10.9080, 78.7280]
    ]
  }
];

export const initialDrivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Murugan Selvam',
    phone: '+91 98421 11001',
    email: 'murugan.driver@citytrack.in',
    assignedBusId: 'bus-1',
    assignedBusNumber: '101',
    assignedRouteId: 'route-1',
    licenseNumber: 'TN-45-20120008431',
    status: 'on_trip',
    rating: 4.9
  },
  {
    id: 'driver-2',
    name: 'Karthik Subramanian',
    phone: '+91 97892 22002',
    email: 'karthik.driver@citytrack.in',
    assignedBusId: 'bus-2',
    assignedBusNumber: '102',
    assignedRouteId: 'route-2',
    licenseNumber: 'TN-45-20150009512',
    status: 'on_trip',
    rating: 4.8
  },
  {
    id: 'driver-3',
    name: 'A. Joseph Xavier',
    phone: '+91 99443 33003',
    email: 'joseph.driver@citytrack.in',
    assignedBusId: 'bus-3',
    assignedBusNumber: '204',
    assignedRouteId: 'route-3',
    licenseNumber: 'TN-45-20110006721',
    status: 'on_trip',
    rating: 4.7
  },
  {
    id: 'driver-4',
    name: 'R. Veeramani',
    phone: '+91 98944 44004',
    email: 'veeramani.driver@citytrack.in',
    assignedBusId: 'bus-4',
    assignedBusNumber: '305',
    assignedRouteId: 'route-4',
    licenseNumber: 'TN-45-20180004190',
    status: 'on_trip',
    rating: 4.6
  },
  {
    id: 'driver-5',
    name: 'M. Senthil Kumar',
    phone: '+91 94435 55005',
    email: 'senthil.driver@citytrack.in',
    assignedBusId: 'bus-5',
    assignedBusNumber: '408',
    assignedRouteId: 'route-5',
    licenseNumber: 'TN-45-20160007882',
    status: 'on_duty',
    rating: 4.9
  }
];

export const initialBuses: Bus[] = [
  {
    id: 'bus-1',
    busNumber: '101',
    registrationNumber: 'TN-01-AB-1234',
    driverId: 'driver-1',
    driverName: 'Murugan Selvam',
    driverPhone: '+91 98421 11001',
    routeId: 'route-1',
    routeNumber: '101',
    routeName: 'Central Bus Stand ⇄ Srirangam Temple',
    latitude: 10.8062,
    longitude: 78.6920,
    heading: 32,
    speed: 34,
    status: 'active',
    occupancy: 'medium',
    currentStopIndex: 2,
    nextStopName: 'Gandhi Market',
    nextStopDistanceKm: 1.3,
    nextStopEtaMinutes: 4,
    destination: 'Srirangam Rajagopuram',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'bus-2',
    busNumber: '102',
    registrationNumber: 'TN-01-BC-5678',
    driverId: 'driver-2',
    driverName: 'Karthik Subramanian',
    driverPhone: '+91 97892 22002',
    routeId: 'route-2',
    routeNumber: '102',
    routeName: 'Railway Junction ⇄ NIT Trichy Campus',
    latitude: 10.7890,
    longitude: 78.7040,
    heading: 110,
    speed: 42,
    status: 'active',
    occupancy: 'high',
    currentStopIndex: 3,
    nextStopName: 'Ponmalai Golden Rock Workshop',
    nextStopDistanceKm: 2.1,
    nextStopEtaMinutes: 5,
    destination: 'NIT Trichy Campus Gate',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'bus-3',
    busNumber: '204',
    registrationNumber: 'TN-45-CD-9012',
    driverId: 'driver-3',
    driverName: 'A. Joseph Xavier',
    driverPhone: '+91 99443 33003',
    routeId: 'route-3',
    routeNumber: '204',
    routeName: 'Chathiram Bus Stand ⇄ Airport via K.K. Nagar',
    latitude: 10.8190,
    longitude: 78.6750,
    heading: 200,
    speed: 28,
    status: 'active',
    occupancy: 'low',
    currentStopIndex: 2,
    nextStopName: 'Bishop Heber College',
    nextStopDistanceKm: 1.4,
    nextStopEtaMinutes: 3,
    destination: 'Tiruchirappalli International Airport',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'bus-4',
    busNumber: '305',
    registrationNumber: 'TN-45-EF-3456',
    driverId: 'driver-4',
    driverName: 'R. Veeramani',
    driverPhone: '+91 98944 44004',
    routeId: 'route-4',
    routeNumber: '305',
    routeName: 'Central Bus Stand ⇄ BHEL Township via Golden Rock',
    latitude: 10.7760,
    longitude: 78.6890,
    heading: 65,
    speed: 36,
    status: 'active',
    occupancy: 'medium',
    currentStopIndex: 2,
    nextStopName: 'TVS Tollgate',
    nextStopDistanceKm: 1.9,
    nextStopEtaMinutes: 5,
    destination: 'BHEL Township Kailasapuram',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'bus-5',
    busNumber: '408',
    registrationNumber: 'TN-45-GH-7890',
    driverId: 'driver-5',
    driverName: 'M. Senthil Kumar',
    driverPhone: '+91 94435 55005',
    routeId: 'route-5',
    routeNumber: '408',
    routeName: 'Heritage Express: Rockfort ⇄ Samayapuram',
    latitude: 10.8445,
    longitude: 78.6980,
    heading: 15,
    speed: 48,
    status: 'active',
    occupancy: 'low',
    currentStopIndex: 5,
    nextStopName: 'Samayapuram Toll Plaza',
    nextStopDistanceKm: 6.8,
    nextStopEtaMinutes: 12,
    destination: 'Samayapuram Toll Plaza',
    lastUpdated: new Date().toISOString()
  }
];

export const initialUsers: (User & { passwordHash?: string })[] = [
  // Admin user
  {
    id: 'user-admin',
    name: 'Divya Sundaram (Chief Controller)',
    email: 'admin@citytrack.in',
    phone: '+91 94422 99000',
    role: 'admin',
    passwordHash: 'admin123',
    createdAt: '2026-01-10T08:00:00Z'
  },
  // Driver users
  {
    id: 'user-driver-1',
    name: 'Murugan Selvam',
    email: 'murugan.driver@citytrack.in',
    phone: '+91 98421 11001',
    role: 'driver',
    passwordHash: 'driver123',
    createdAt: '2026-02-01T09:00:00Z'
  },
  {
    id: 'user-driver-2',
    name: 'Karthik Subramanian',
    email: 'karthik.driver@citytrack.in',
    phone: '+91 97892 22002',
    role: 'driver',
    passwordHash: 'driver123',
    createdAt: '2026-02-01T09:00:00Z'
  },
  // 10 Sample passengers
  {
    id: 'user-p1',
    name: 'Priya Rajendran',
    email: 'priya@gmail.com',
    phone: '+91 98401 12345',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'user-p2',
    name: 'Anand Natarajan',
    email: 'anand@gmail.com',
    phone: '+91 97910 23456',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'user-p3',
    name: 'Kavitha Balaji',
    email: 'kavitha@gmail.com',
    phone: '+91 94431 34567',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-03T09:30:00Z'
  },
  {
    id: 'user-p4',
    name: 'Vignesh Srinivasan',
    email: 'vignesh@gmail.com',
    phone: '+91 98840 45678',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-04T14:15:00Z'
  },
  {
    id: 'user-p5',
    name: 'Meena Lakshman',
    email: 'meena@gmail.com',
    phone: '+91 99402 56789',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-05T16:20:00Z'
  },
  {
    id: 'user-p6',
    name: 'Suresh Krishnan',
    email: 'suresh@gmail.com',
    phone: '+91 98413 67890',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-06T08:45:00Z'
  },
  {
    id: 'user-p7',
    name: 'Deepa Muthukumar',
    email: 'deepa@gmail.com',
    phone: '+91 97894 78901',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-07T12:00:00Z'
  },
  {
    id: 'user-p8',
    name: 'Pravin Kumar',
    email: 'pravin@gmail.com',
    phone: '+91 99625 89012',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-08T15:30:00Z'
  },
  {
    id: 'user-p9',
    name: 'Aishwarya Raman',
    email: 'aishwarya@gmail.com',
    phone: '+91 98426 90123',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-09T18:10:00Z'
  },
  {
    id: 'user-p10',
    name: 'Saravanan Pandian',
    email: 'saravanan@gmail.com',
    phone: '+91 94447 01234',
    role: 'passenger',
    passwordHash: 'passenger123',
    createdAt: '2026-03-10T19:40:00Z'
  }
];

export const initialTrips: Trip[] = [
  {
    id: 'trip-101-today',
    busId: 'bus-1',
    busNumber: '101',
    driverId: 'driver-1',
    driverName: 'Murugan Selvam',
    routeId: 'route-1',
    routeName: 'Central Bus Stand ⇄ Srirangam Temple',
    startTime: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    status: 'in_progress',
    passengersCarried: 34,
    currentStop: 'Palakkarai Roundabout'
  },
  {
    id: 'trip-102-today',
    busId: 'bus-2',
    busNumber: '102',
    driverId: 'driver-2',
    driverName: 'Karthik Subramanian',
    routeId: 'route-2',
    routeName: 'Railway Junction ⇄ NIT Trichy Campus',
    startTime: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    status: 'in_progress',
    passengersCarried: 48,
    currentStop: 'TVS Tollgate'
  },
  {
    id: 'trip-204-today',
    busId: 'bus-3',
    busNumber: '204',
    driverId: 'driver-3',
    driverName: 'A. Joseph Xavier',
    routeId: 'route-3',
    routeName: 'Chathiram Bus Stand ⇄ Airport via K.K. Nagar',
    startTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'in_progress',
    passengersCarried: 22,
    currentStop: 'KMC Speciality Hospital'
  },
  {
    id: 'trip-305-today',
    busId: 'bus-4',
    busNumber: '305',
    driverId: 'driver-4',
    driverName: 'R. Veeramani',
    routeId: 'route-4',
    routeName: 'Central Bus Stand ⇄ BHEL Township via Golden Rock',
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'in_progress',
    passengersCarried: 29,
    currentStop: 'K.K. Nagar Terminus'
  },
  {
    id: 'trip-408-today',
    busId: 'bus-5',
    busNumber: '408',
    driverId: 'driver-5',
    driverName: 'M. Senthil Kumar',
    routeId: 'route-5',
    routeName: 'Heritage Express: Rockfort ⇄ Samayapuram',
    startTime: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    status: 'in_progress',
    passengersCarried: 41,
    currentStop: 'Mambazhasalai Bridge'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Bus Arriving Soon',
    message: 'Bus 101 is approaching Gandhi Market in approximately 4 minutes.',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    busNumber: '101',
    routeNumber: '101'
  },
  {
    id: 'notif-2',
    title: 'Trip Started',
    message: 'Bus 204 started morning express trip from Chathiram Bus Stand toward Airport.',
    type: 'success',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    busNumber: '204',
    routeNumber: '204'
  },
  {
    id: 'notif-3',
    title: 'Traffic Advisory',
    message: 'Cauvery bridge traffic is moving smoothly. Bus 408 is on schedule.',
    type: 'info',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    busNumber: '408',
    routeNumber: '408'
  }
];
