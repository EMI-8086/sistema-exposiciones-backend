import { FastifyRequest, FastifyReply } from 'fastify';
import { SupabaseClient } from '@supabase/supabase-js';
import { AlumnoRepository } from '../repositories/alumnoRepository';
import { AlumnoService } from '../services/alumnoService';

export class AlumnoController {
  async listAll(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new AlumnoRepository(supabaseClient);
    const service = new AlumnoService(repository);
    const query = request.query as any;
    const page = parseInt(query.page || '0');
    const size = parseInt(query.size || '10');
    const search = query.search;
    const result = await service.listAll(page, size, search);
    reply.send(result);
  }

  async getById(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new AlumnoRepository(supabaseClient);
    const service = new AlumnoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    const currentUserId = (request as any).user?.id;
    const currentUserRol = (request as any).user?.rol;
    try {
      const alumno = await service.getById(id, currentUserId, currentUserRol);
      reply.send(alumno);
    } catch (error: any) {
      reply.status(403).send({ error: error.message });
    }
  }

  async getPerfil(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new AlumnoRepository(supabaseClient);
    const service = new AlumnoService(repository);
    const usuarioId = (request as any).user?.id;
    if (!usuarioId) {
      return reply.status(401).send({ error: 'Usuario no autenticado' });
    }
    try {
      const perfil = await service.getPerfil(usuarioId);
      reply.send(perfil);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new AlumnoRepository(supabaseClient);
    const service = new AlumnoService(repository);
    const body = request.body as { matricula: string; nombre: string; apellido: string; email: string; id_usuario?: string };
    try {
      const nuevo = await service.create(body);
      reply.status(201).send(nuevo);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new AlumnoRepository(supabaseClient);
    const service = new AlumnoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    const body = request.body as { matricula?: string; nombre?: string; apellido?: string; email?: string };
    const currentUserId = (request as any).user?.id;
    const currentUserRol = (request as any).user?.rol;
    try {
      const updated = await service.update(id, body, currentUserId, currentUserRol);
      reply.send(updated);
    } catch (error: any) {
      reply.status(error.message.includes('permiso') ? 403 : 404).send({ error: error.message });
    }
  }

  async delete(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new AlumnoRepository(supabaseClient);
    const service = new AlumnoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    try {
      await service.delete(id);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }
}