import { FastifyInstance } from 'fastify';
import { ExposicionController } from '../controllers/exposicionController';
import { authMiddleware } from '../middlewares/auth';

export async function exposicionRoutes(fastify: FastifyInstance) {
  const controller = new ExposicionController();

  fastify.get('/exposiciones', { preHandler: authMiddleware }, (req, rep) => controller.listByEquipo(req.supabaseClient!, req, rep));
  fastify.get('/exposiciones/:id', { preHandler: authMiddleware }, (req, rep) => controller.getById(req.supabaseClient!, req, rep));
  fastify.post('/exposiciones', { preHandler: authMiddleware }, (req, rep) => controller.create(req.supabaseClient!, req, rep));
  fastify.put('/exposiciones/:id', { preHandler: authMiddleware }, (req, rep) => controller.update(req.supabaseClient!, req, rep));
  fastify.delete('/exposiciones/:id', { preHandler: authMiddleware }, (req, rep) => controller.delete(req.supabaseClient!, req, rep));
}