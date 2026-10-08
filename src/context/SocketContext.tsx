import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Bus, BusRoute, BusStop, SystemNotification, Trip, Driver } from '../types/index.ts';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  buses: Bus[];
  routes: BusRoute[];
  stops: BusStop[];
  drivers: Driver[];
  notifications: SystemNotification[];
  activeTrips: Trip[];
  simulationActive: boolean;
  simulationSpeed: number;
  selectedBusId: string | null;
  setSelectedBusId: (id: string | null) => void;
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  toggleSimulation: (enabled?: boolean) => Promise<void>;
  setSimulationSpeedMultiplier: (speed: number) => Promise<void>;
  sendDriverLocation: (busId: string, lat: number, lng: number, speed?: number) => void;
  refreshAllData: () => Promise<void>;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [stops, setStops] = useState<BusStop[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [simulationActive, setSimulationActive] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  // Default to central city coordinates
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: 10.8040,
    lng: 78.6890
  });

  const refreshAllData = useCallback(async () => {
    try {
      const [busesRes, routesRes, stopsRes, driversRes, notifsRes, tripsRes, simRes] = await Promise.all([
        fetch('/api/buses'),
        fetch('/api/routes'),
        fetch('/api/stops'),
        fetch('/api/drivers'),
        fetch('/api/notifications'),
        fetch('/api/trips?status=in_progress'),
        fetch('/api/simulation/status')
      ]);

      if (busesRes.ok) setBuses(await busesRes.json());
      if (routesRes.ok) setRoutes(await routesRes.json());
      if (stopsRes.ok) setStops(await stopsRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());
      if (notifsRes.ok) setNotifications(await notifsRes.json());
      if (tripsRes.ok) setActiveTrips(await tripsRes.json());
      if (simRes.ok) {
        const sim = await simRes.json();
        setSimulationActive(sim.active);
        setSimulationSpeed(sim.speed);
      }
    } catch (err) {
      console.warn('Initial data fetch notice:', err);
    }
  }, []);

  useEffect(() => {
    refreshAllData();

    // Initialize Socket connection
    const newSocket = io(window.location.origin, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('initialData', data => {
      if (data.buses) setBuses(data.buses);
      if (data.activeTrips) setActiveTrips(data.activeTrips);
      if (data.notifications) setNotifications(data.notifications);
    });

    // Real-time bus location update broadcast
    newSocket.on('busLocationUpdate', (updatedBus: Bus) => {
      setBuses(prev => {
        const index = prev.findIndex(b => b.id === updatedBus.id);
        if (index === -1) {
          return [...prev, updatedBus];
        }
        const updated = [...prev];
        updated[index] = { ...updated[index], ...updatedBus };
        return updated;
      });
    });

    newSocket.on('tripStarted', (newTrip: Trip) => {
      setActiveTrips(prev => [newTrip, ...prev.filter(t => t.id !== newTrip.id)]);
      refreshAllData();
    });

    newSocket.on('tripStopped', (endedTrip: Trip) => {
      setActiveTrips(prev => prev.filter(t => t.id !== endedTrip.id && t.busId !== endedTrip.busId));
      refreshAllData();
    });

    newSocket.on('notification', (notif: SystemNotification) => {
      setNotifications(prev => [notif, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [refreshAllData]);

  const toggleSimulation = async (enabled?: boolean) => {
    try {
      const res = await fetch('/api/simulation/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationActive(data.active);
        setSimulationSpeed(data.speed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const setSimulationSpeedMultiplier = async (speed: number) => {
    try {
      const res = await fetch('/api/simulation/speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier: speed })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationSpeed(data.speed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendDriverLocation = (busId: string, lat: number, lng: number, speed: number = 30) => {
    if (socket && isConnected) {
      socket.emit('driverLocation', { busId, latitude: lat, longitude: lng, speed });
    } else {
      // Fallback to REST API
      fetch(`/api/buses/${busId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng, speed })
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        buses,
        routes,
        stops,
        drivers,
        notifications,
        activeTrips,
        simulationActive,
        simulationSpeed,
        selectedBusId,
        setSelectedBusId,
        selectedRouteId,
        setSelectedRouteId,
        toggleSimulation,
        setSimulationSpeedMultiplier,
        sendDriverLocation,
        refreshAllData,
        userLocation,
        setUserLocation
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
