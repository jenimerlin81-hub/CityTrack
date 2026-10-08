import { Router, Request, Response } from 'express';
import { db } from '../store/db.ts';

const router = Router();

// GET /api/routes
router.get('/', (req: Request, res: Response) => {
  const { search } = req.query;
  let routes = db.getRoutes();

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    routes = routes.filter(
      r =>
        r.routeNumber.toLowerCase().includes(q) ||
        r.routeName.toLowerCase().includes(q) ||
        r.startPoint.toLowerCase().includes(q) ||
        r.endPoint.toLowerCase().includes(q) ||
        r.stops.some(s => s.stopName.toLowerCase().includes(q))
    );
  }

  res.json(routes);
});

// GET /api/routes/:id
router.get('/:id', (req: Request, res: Response) => {
  const route = db.getRouteById(req.params.id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route);
});

// POST /api/routes
router.post('/', (req: Request, res: Response) => {
  const { routeNumber, routeName, startPoint, endPoint, color, fare, stops, coordinates } = req.body;

  if (!routeNumber || !routeName || !startPoint || !endPoint) {
    return res.status(400).json({ error: 'Route number, name, start point and end point are required' });
  }

  const newRoute = db.createRoute({
    routeNumber,
    routeName,
    startPoint,
    endPoint,
    color: color || '#3B82F6',
    fare: Number(fare) || 15,
    stops: stops || [],
    coordinates: coordinates || []
  });

  db.addNotification({
    title: 'New Route Added',
    message: `Route ${newRoute.routeNumber} (${newRoute.startPoint} ⇄ ${newRoute.endPoint}) has been activated.`,
    type: 'success',
    routeNumber: newRoute.routeNumber
  });

  res.status(201).json(newRoute);
});

// PUT /api/routes/:id
router.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateRoute(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(updated);
});

// DELETE /api/routes/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteRoute(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json({ success: true, message: 'Route deleted successfully' });
});

export default router;
