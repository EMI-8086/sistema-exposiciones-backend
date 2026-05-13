import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/authService';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  matricula: z.string().optional(),
});

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Datos inválidos', details: result.error });
    }
    const { email, password } = result.data;
    try {
      const data = await this.authService.login(email, password);
      reply.send(data);
    } catch (error: any) {
      reply.status(401).send({ error: error.message });
    }
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const result = registerSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: 'Datos inválidos', details: result.error });
    }
    const { email, password, nombre, apellido, matricula } = result.data;
    try {
      const data = await this.authService.register(email, password, { nombre, apellido, matricula });
      reply.status(201).send(data);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}