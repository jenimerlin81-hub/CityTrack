import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import authRouter from './server/routes/auth.ts';
import busesRouter from './server/routes/buses.ts';
import routesRouter from './server/routes/routes.ts';
import stopsRouter from './server/routes/stops.ts';
import tripsRouter from './server/routes/trips.ts';
import usersRouter from './server/routes/users.ts';
import { simulationService } from './server/services/simulationService.ts';
import { db } from './server/store/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Socket.IO real-time event setup
  io.on('connection', socket => {
    // Send initial snapshot
    socket.emit('initialData', {
      buses: db.getBuses(),
      activeTrips: db.getTrips().filter(t => t.status === 'in_progress'),
      notifications: db.getNotifications().slice(0, 5)
    });

    // Driver live GPS streaming event
    socket.on('driverLocation', data => {
      const { busId, latitude, longitude, speed } = data;
      if (busId && typeof latitude === 'number' && typeof longitude === 'number') {
        const updated = simulationService.handleManualDriverUpdate(busId, latitude, longitude, speed);
        if (updated) {
          io.emit('busLocationUpdate', updated);
        }
      }
    });

    // Driver start trip
    socket.on('tripStarted', data => {
      io.emit('tripStarted', data);
    });

    // Driver stop trip
    socket.on('tripStopped', data => {
      io.emit('tripStopped', data);
    });
  });

  // Initialize simulation service with Socket.IO
  simulationService.init(io);

  // Mount API routes
  app.use('/api/auth', authRouter);
  app.use('/api/buses', busesRouter);
  app.use('/api/routes', routesRouter);
  app.use('/api/stops', stopsRouter);
  app.use('/api/trips', tripsRouter);
  app.use('/api', usersRouter);

  // API healthcheck
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'CityTrack Real-Time Transit Engine',
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware in dev or static dist in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[CityTrack] Full-stack transit server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CityTrack] Failed to start server:', err);
});
