import { FastifyInstance } from 'fastify';
import { EquipoController } from '../controllers/equipoController';
import { authMiddleware } from '../middlewares/auth';

export async function equipoRoutes(fastify: FastifyInstance) {
  const controller = new EquipoController();

  fastify.get('/equipos', { preHandler: authMiddleware }, (req, rep) => controller.listByGrupo(req.supabaseClient!, req, rep));
  fastify.get('/equipos/:id', { preHandler: authMiddleware }, (req, rep) => controller.getById(req.supabaseClient!, req, rep));
  fastify.post('/equipos', { preHandler: authMiddleware }, (req, rep) => controller.create(req.supabaseClient!, req, rep));
  fastify.put('/equipos/:id', { preHandler: authMiddleware }, (req, rep) => controller.update(req.supabaseClient!, req, rep));
  fastify.delete('/equipos/:id', { preHandler: authMiddleware }, (req, rep) => controller.delete(req.supabaseClient!, req, rep));
  fastify.post('/equipos/:equipoId/alumnos', { preHandler: authMiddleware }, (req, rep) => controller.addAlumno(req.supabaseClient!, req, rep));
  fastify.delete('/equipos/:equipoId/alumnos/:alumnoId', { preHandler: authMiddleware }, (req, rep) => controller.removeAlumno(req.supabaseClient!, req, rep));
}