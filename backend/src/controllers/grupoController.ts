import { FastifyRequest, FastifyReply } from 'fastify';
import { SupabaseClient } from '@supabase/supabase-js';
import { GrupoRepository } from '../repositories/grupoRepository';
import { GrupoService } from '../services/grupoService';

export class GrupoController {
  async listByMateria(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new GrupoRepository(supabaseClient);
    const service = new GrupoService(repository);
    const query = request.query as any;
    const materiaId = parseInt(query.materiaId);
    const page = parseInt(query.page || '0');
    const size = parseInt(query.size || '10');
    const result = await service.listByMateria(materiaId, page, size);
    reply.send(result);
  }

  async getById(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new GrupoRepository(supabaseClient);
    const service = new GrupoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    try {
      const grupo = await service.getById(id);
      reply.send(grupo);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new GrupoRepository(supabaseClient);
    const service = new GrupoService(repository);
    const body = request.body as { nombre_grupo: string; periodo: string; id_materia: number };
    try {
      const nuevo = await service.create(body);
      reply.status(201).send(nuevo);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new GrupoRepository(supabaseClient);
    const service = new GrupoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    const body = request.body as { nombre_grupo?: string; periodo?: string; id_materia?: number };
    try {
      const updated = await service.update(id, body);
      reply.send(updated);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async delete(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new GrupoRepository(supabaseClient);
    const service = new GrupoService(repository);
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