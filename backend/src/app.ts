import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/authRoutes';
import { materiaRoutes } from './routes/materiaRoutes';
import { grupoRoutes } from './routes/groupRoutes';
import { alumnoRoutes } from './routes/alumnoRoutes';
import { equipoRoutes } from './routes/equipoRoutes';
import { exposicionRoutes } from './routes/exposicionRoutes';
import { evaluacionRoutes } from './routes/evaluacionRoutes';

// Variables de entorno
const PORT = Number(process.env.PORT) || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || '*'; //URL del frontend

const fastify = Fastify({ logger: true });

// CORS: permite el origen del frontend (útil para desarrollo y producción)
fastify.register(cors, {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

// Healthcheck (útil para monitoreo y para evitar suspensión por inactividad)
fastify.get('/health', async (req, rep) => {
  rep.send({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejador de rutas no encontradas (404)
fastify.setNotFoundHandler((req, rep) => {
  rep.status(404).send({ error: 'Not Found', message: `La ruta ${req.url} no existe` });
});

// Registrar todas las rutas bajo el prefijo /api/v1
fastify.register(async (instance) => {
  await instance.register(authRoutes);
  await instance.register(materiaRoutes);
  await instance.register(grupoRoutes);
  await instance.register(alumnoRoutes);
  await instance.register(equipoRoutes);
  await instance.register(exposicionRoutes);
  await instance.register(evaluacionRoutes);
}, { prefix: '/api/v1' });

// Manejador global de errores
fastify.setErrorHandler((error: any, request, reply) => {
  fastify.log.error(error);
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'Ocurrió un error inesperado',
    statusCode
  });
});

// Iniciar servidor
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Servidor escuchando en http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();