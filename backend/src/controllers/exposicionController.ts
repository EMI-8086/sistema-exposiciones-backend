import { FastifyRequest, FastifyReply } from 'fastify';
import { SupabaseClient } from '@supabase/supabase-js';
import { ExposicionRepository } from '../repositories/exposicionRepository';
import { ExposicionService } from '../services/exposicionesService';

export class ExposicionController {
  async listByEquipo(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new ExposicionRepository(supabaseClient);
    const service = new ExposicionService(repository);
    const query = request.query as any;
    const equipoId = parseInt(query.equipoId);
    const page = parseInt(query.page || '0');
    const size = parseInt(query.size || '10');
    const result = await service.listByEquipo(equipoId, page, size);
    reply.send(result);
  }

  async getById(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new ExposicionRepository(supabaseClient);
    const service = new ExposicionService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    try {
      const exposicion = await service.getById(id);
      reply.send(exposicion);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new ExposicionRepository(supabaseClient);
    const service = new ExposicionService(repository);
    const body = request.body as { titulo: string; fecha_exposicion: string; id_equipo: number; rubrica?: any };
    try {
      const nueva = await service.create(body);
      reply.status(201).send(nueva);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new ExposicionRepository(supabaseClient);
    const service = new ExposicionService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    const body = request.body as { titulo?: string; fecha_exposicion?: string; rubrica?: any };
    try {
      const updated = await service.update(id, body);
      reply.send(updated);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async delete(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new ExposicionRepository(supabaseClient);
    const service = new ExposicionService(repository);
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