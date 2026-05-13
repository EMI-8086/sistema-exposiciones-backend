import { FastifyInstance } from 'fastify';
import { EvaluacionController } from '../controllers/evaluacionController';
import { authMiddleware } from '../middlewares/auth';

export async function evaluacionRoutes(fastify: FastifyInstance) {
  const controller = new EvaluacionController();

  fastify.post('/evaluaciones', { preHandler: authMiddleware }, (req, rep) => controller.registrar(req.supabaseClient!, req, rep));
  fastify.get('/exposiciones/:idExposicion/evaluaciones', { preHandler: authMiddleware }, (req, rep) => controller.listByExposicion(req.supabaseClient!, req, rep));
  fastify.get('/exposiciones/:idExposicion/mi-evaluacion', { preHandler: authMiddleware }, (req, rep) => controller.obtenerEvaluacionPropia(req.supabaseClient!, req, rep));
}