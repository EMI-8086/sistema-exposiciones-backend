import { FastifyInstance } from 'fastify';
import { MateriaController } from '../controllers/materiaController';
import { authMiddleware } from '../middlewares/auth';

export async function materiaRoutes(fastify: FastifyInstance) {
  const controller = new MateriaController();

  fastify.get('/materias', { preHandler: authMiddleware }, (req, rep) => controller.list(req.supabaseClient!, req, rep));
  fastify.get('/materias/:id', { preHandler: authMiddleware }, (req, rep) => controller.getById(req.supabaseClient!, req, rep));
  fastify.post('/materias', { preHandler: authMiddleware }, (req, rep) => controller.create(req.supabaseClient!, req, rep));
  fastify.put('/materias/:id', { preHandler: authMiddleware }, (req, rep) => controller.update(req.supabaseClient!, req, rep));
  fastify.delete('/materias/:id', { preHandler: authMiddleware }, (req, rep) => controller.delete(req.supabaseClient!, req, rep));
}