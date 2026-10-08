import { Router, Request, Response } from 'express';
import { db } from '../store/db.ts';
import { calculateDistanceKm } from '../services/etaService.ts';

const router = Router();

// GET /api/stops
router.get('/', (req: Request, res: Response) => {
  const { search, zone } = req.query;
  let stops = db.getStops();

  if (zone && typeof zone === 'string') {
    stops = stops.filter(s => s.zone?.toLowerCase() === zone.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    stops = stops.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.landmark && s.landmark.toLowerCase().includes(q))
    );
  }

  res.json(stops);
});

// GET /api/stops/nearby?lat=10.80&lng=78.69&radius=3
router.get('/nearby', (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const radius = parseFloat(req.query.radius as string) || 3.0; // default 3 km

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ error: 'Valid lat and lng query parameters required' });
  }

  const allStops = db.getStops();
  const stopsWithDistance = allStops
    .map(stop => {
      const distanceKm = calculateDistanceKm(lat, lng, stop.latitude, stop.longitude);
      return {
        ...stop,
        distanceKm
      };
    })
    .filter(s => s.distanceKm <= radius)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(stopsWithDistance);
});

// POST /api/stops
router.post('/', (req: Request, res: Response) => {
  const { name, code, latitude, longitude, routes, landmark, zone } = req.body;

  if (!name || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Stop name, latitude, and longitude are required' });
  }

  const newStop = db.createStop({
    name,
    code: code || `STP-${Math.floor(10 + Math.random() * 90)}`,
    latitude,
    longitude,
    routes: routes || [],
    landmark: landmark || '',
    zone: zone || 'Central'
  });

  res.status(201).json(newStop);
});

export default router;
