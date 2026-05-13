import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../services/authService';
import { supabase } from '../config/supabase';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();
  const authController = new AuthController(authService);

  fastify.post('/auth/login', (req, rep) => authController.login(req, rep));
  fastify.post('/auth/register', (req, rep) => authController.register(req, rep));
}