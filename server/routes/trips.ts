import { Router, Request, Response } from 'express';
import { db } from '../store/db.ts';

const router = Router();

// GET /api/trips
router.get('/', (req: Request, res: Response) => {
  const { busId, status } = req.query;
  let trips = db.getTrips();

  if (busId && typeof busId === 'string') {
    trips = trips.filter(t => t.busId === busId);
  }

  if (status && typeof status === 'string') {
    trips = trips.filter(t => t.status === status);
  }

  res.json(trips);
});

// POST /api/trips/start
router.post('/start', (req: Request, res: Response) => {
  const { busId, driverId, routeId, passengersCarried } = req.body;

  const bus = db.getBusById(busId);
  const driver = db.getDriverById(driverId);
  const route = db.getRouteById(routeId || bus?.routeId || '');

  const newTrip = db.createTrip({
    busId: bus?.id || busId,
    busNumber: bus?.busNumber || 'Bus',
    driverId: driver?.id || driverId,
    driverName: driver?.name || 'Driver',
    routeId: route?.id || routeId,
    routeName: route?.routeName || bus?.routeName || 'City Line',
    passengersCarried: Number(passengersCarried) || 15,
    currentStop: bus?.nextStopName || 'Origin Terminus'
  });

  if (bus) {
    db.updateBus(bus.id, { status: 'active' });
  }

  if (driver) {
    db.updateDriver(driver.id, { status: 'on_trip' });
  }

  db.addNotification({
    title: 'Trip Started',
    message: `Bus ${newTrip.busNumber} started journey on Route ${route?.routeNumber || 'Main'}.`,
    type: 'success',
    busNumber: newTrip.busNumber
  });

  res.status(201).json(newTrip);
});

// POST /api/trips/stop
router.post('/stop', (req: Request, res: Response) => {
  const { tripId, busId } = req.body;
  const targetId = tripId || busId;

  if (!targetId) {
    return res.status(400).json({ error: 'Trip ID or Bus ID required' });
  }

  const ended = db.endTrip(targetId);
  if (!ended) {
    return res.status(404).json({ error: 'Active trip not found' });
  }

  if (ended.busId) {
    db.updateBus(ended.busId, { status: 'idle', speed: 0 });
  }

  if (ended.driverId) {
    db.updateDriver(ended.driverId, { status: 'on_duty' });
  }

  db.addNotification({
    title: 'Trip Completed',
    message: `Bus ${ended.busNumber} has safely completed its trip.`,
    type: 'info',
    busNumber: ended.busNumber
  });

  res.json({ success: true, trip: ended });
});

export default router;
