import { FastifyInstance } from 'fastify';
import { AlumnoController } from '../controllers/alumnoController';
import { authMiddleware } from '../middlewares/auth';

export async function alumnoRoutes(fastify: FastifyInstance) {
  const controller = new AlumnoController();

  fastify.get('/alumnos', { preHandler: authMiddleware }, (req, rep) => controller.listAll(req.supabaseClient!, req, rep));
  fastify.get('/alumnos/perfil', { preHandler: authMiddleware }, (req, rep) => controller.getPerfil(req.supabaseClient!, req, rep));
  fastify.get('/alumnos/:id', { preHandler: authMiddleware }, (req, rep) => controller.getById(req.supabaseClient!, req, rep));
  fastify.post('/alumnos', { preHandler: authMiddleware }, (req, rep) => controller.create(req.supabaseClient!, req, rep));
  fastify.put('/alumnos/:id', { preHandler: authMiddleware }, (req, rep) => controller.update(req.supabaseClient!, req, rep));
  fastify.delete('/alumnos/:id', { preHandler: authMiddleware }, (req, rep) => controller.delete(req.supabaseClient!, req, rep));
}