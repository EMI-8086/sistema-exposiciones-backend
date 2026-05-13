import { FastifyInstance } from 'fastify';
import { GrupoController } from '../controllers/grupoController';
import { authMiddleware } from '../middlewares/auth';

export async function grupoRoutes(fastify: FastifyInstance) {
  const controller = new GrupoController();

  fastify.get('/grupos', { preHandler: authMiddleware }, (req, rep) => controller.listByMateria(req.supabaseClient!, req, rep));
  fastify.get('/grupos/:id', { preHandler: authMiddleware }, (req, rep) => controller.getById(req.supabaseClient!, req, rep));
  fastify.post('/grupos', { preHandler: authMiddleware }, (req, rep) => controller.create(req.supabaseClient!, req, rep));
  fastify.put('/grupos/:id', { preHandler: authMiddleware }, (req, rep) => controller.update(req.supabaseClient!, req, rep));
  fastify.delete('/grupos/:id', { preHandler: authMiddleware }, (req, rep) => controller.delete(req.supabaseClient!, req, rep));
}