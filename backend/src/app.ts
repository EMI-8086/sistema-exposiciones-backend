import Fastify from 'fastify';
import cors from '@fastify/cors';
import { materiaRoutes } from './routes/materiaRoutes';
import { grupoRoutes } from './routes/groupRoutes';
import { alumnoRoutes } from './routes/alumnoRoutes';
import { equipoRoutes } from './routes/equipoRoutes';
import { exposicionRoutes } from './routes/exposicionRoutes';
import { evaluacionRoutes } from './routes/evaluacionRoutes';
import { authRoutes } from './routes/authRoutes';

const fastify = Fastify({ logger: true });

fastify.get('/health', async (req, rep) => {
  rep.send({ status: 'ok', timestamp: new Date().toISOString() });
});

fastify.register(cors, { origin: '*' });

// Registrar rutas
fastify.register(authRoutes);       // /auth/login (usa Supabase Auth)
fastify.register(materiaRoutes);
fastify.register(grupoRoutes);
fastify.register(alumnoRoutes);
fastify.register(equipoRoutes);
fastify.register(exposicionRoutes);
fastify.register(evaluacionRoutes);

fastify.setNotFoundHandler((req, rep) => {
  rep.status(404).send({ error: 'Not Found', message: `Ruta ${req.url} no existe` });
});

fastify.listen({ port: Number(process.env.PORT) || 8080, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});