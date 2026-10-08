import { Router, Request, Response } from 'express';
import { db } from '../store/db.ts';
import { simulationService } from '../services/simulationService.ts';

const router = Router();

// GET /api/users
router.get('/users', (req: Request, res: Response) => {
  const { role } = req.query;
  let users = db.getUsers().map(u => {
    const { passwordHash: _, ...safeUser } = u;
    return safeUser;
  });

  if (role && typeof role === 'string') {
    users = users.filter(u => u.role === role);
  }

  res.json(users);
});

// GET /api/drivers
router.get('/drivers', (_req: Request, res: Response) => {
  res.json(db.getDrivers());
});

// POST /api/drivers
router.post('/drivers', (req: Request, res: Response) => {
  const { name, phone, email, licenseNumber, assignedBusId, assignedRouteId } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Driver name and phone are required' });
  }

  const bus = assignedBusId ? db.getBusById(assignedBusId) : undefined;
  const newDriver = db.createDriver({
    name,
    phone,
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}.driver@citytrack.in`,
    licenseNumber: licenseNumber || `TN-45-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    assignedBusId,
    assignedBusNumber: bus?.busNumber,
    assignedRouteId: assignedRouteId || bus?.routeId,
    status: 'on_duty'
  });

  if (bus) {
    db.updateBus(bus.id, {
      driverId: newDriver.id,
      driverName: newDriver.name,
      driverPhone: newDriver.phone
    });
  }

  res.status(201).json(newDriver);
});

// PUT /api/drivers/:id
router.put('/drivers/:id', (req: Request, res: Response) => {
  const updated = db.updateDriver(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json(updated);
});

// DELETE /api/drivers/:id
router.delete('/drivers/:id', (req: Request, res: Response) => {
  const deleted = db.deleteDriver(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json({ success: true, message: 'Driver deleted successfully' });
});

// GET /api/stats
router.get('/stats', (_req: Request, res: Response) => {
  res.json(db.getStats());
});

// GET /api/notifications
router.get('/notifications', (_req: Request, res: Response) => {
  res.json(db.getNotifications());
});

// SIMULATION CONTROL
router.get('/simulation/status', (_req: Request, res: Response) => {
  res.json({
    active: simulationService.isSimulationActive(),
    speed: simulationService.getSpeed()
  });
});

router.post('/simulation/toggle', (req: Request, res: Response) => {
  const { enabled } = req.body;
  if (enabled === true) {
    simulationService.resume();
  } else if (enabled === false) {
    simulationService.pause();
  } else {
    if (simulationService.isSimulationActive()) {
      simulationService.pause();
    } else {
      simulationService.resume();
    }
  }

  res.json({
    active: simulationService.isSimulationActive(),
    speed: simulationService.getSpeed()
  });
});

router.post('/simulation/speed', (req: Request, res: Response) => {
  const { multiplier } = req.body;
  if (typeof multiplier === 'number') {
    simulationService.setSpeed(multiplier);
  }
  res.json({
    active: simulationService.isSimulationActive(),
    speed: simulationService.getSpeed()
  });
});

// POST /api/reset-data
router.post('/reset-data', (_req: Request, res: Response) => {
  db.seed();
  res.json({ success: true, message: 'Demo data reloaded to initial state.' });
});

export default router;
