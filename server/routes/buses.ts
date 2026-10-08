import { Router, Request, Response } from 'express';
import { db } from '../store/db.ts';
import { simulationService } from '../services/simulationService.ts';

const router = Router();

// GET /api/buses
router.get('/', (req: Request, res: Response) => {
  const { search, status, routeId } = req.query;
  let buses = db.getBuses();

  if (status && typeof status === 'string') {
    buses = buses.filter(b => b.status === status);
  }

  if (routeId && typeof routeId === 'string') {
    buses = buses.filter(b => b.routeId === routeId || b.routeNumber === routeId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    buses = buses.filter(
      b =>
        b.busNumber.toLowerCase().includes(q) ||
        b.registrationNumber.toLowerCase().includes(q) ||
        (b.routeName && b.routeName.toLowerCase().includes(q)) ||
        (b.destination && b.destination.toLowerCase().includes(q)) ||
        (b.nextStopName && b.nextStopName.toLowerCase().includes(q))
    );
  }

  res.json(buses);
});

// GET /api/buses/:id
router.get('/:id', (req: Request, res: Response) => {
  const bus = db.getBusById(req.params.id);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  res.json(bus);
});

// POST /api/buses
router.post('/', (req: Request, res: Response) => {
  const { busNumber, registrationNumber, routeId, driverId, destination, status } = req.body;

  if (!busNumber || !registrationNumber) {
    return res.status(400).json({ error: 'Bus number and registration number are required' });
  }

  // Lookup route info
  const route = routeId ? db.getRouteById(routeId) : null;
  const driver = driverId ? db.getDriverById(driverId) : null;

  const newBus = db.createBus({
    busNumber,
    registrationNumber,
    routeId: route?.id || '',
    routeNumber: route?.routeNumber || busNumber,
    routeName: route?.routeName || '',
    destination: destination || route?.endPoint || 'City Center',
    driverId: driver?.id || '',
    driverName: driver?.name || 'Unassigned',
    driverPhone: driver?.phone || '',
    status: status || 'active'
  });

  // notify system
  db.addNotification({
    title: 'Fleet Addition',
    message: `New Bus ${newBus.busNumber} (${newBus.registrationNumber}) added to fleet.`,
    type: 'info',
    busNumber: newBus.busNumber
  });

  res.status(201).json(newBus);
});

// PUT /api/buses/:id
router.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateBus(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  res.json(updated);
});

// DELETE /api/buses/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteBus(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Bus not found' });
  }
  res.json({ success: true, message: 'Bus removed successfully' });
});

// POST /api/buses/:id/location (Driver GPS ping)
router.post('/:id/location', (req: Request, res: Response) => {
  const { latitude, longitude, speed } = req.body;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Valid latitude and longitude required' });
  }

  const updated = simulationService.handleManualDriverUpdate(
    req.params.id,
    latitude,
    longitude,
    typeof speed === 'number' ? speed : 30
  );

  if (!updated) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json({ success: true, bus: updated });
});

export default router;
