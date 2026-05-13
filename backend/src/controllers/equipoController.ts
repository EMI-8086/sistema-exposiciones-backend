import { FastifyRequest, FastifyReply } from 'fastify';
import { SupabaseClient } from '@supabase/supabase-js';
import { EquipoRepository } from '../repositories/equipoRepository';
import { EquipoService } from '../services/equipoService';

export class EquipoController {
  async listByGrupo(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const query = request.query as any;
    const grupoId = parseInt(query.grupoId);
    const page = parseInt(query.page || '0');
    const size = parseInt(query.size || '10');
    const result = await service.listByGrupo(grupoId, page, size);
    reply.send(result);
  }

  async getById(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    try {
      const equipo = await service.getById(id);
      reply.send(equipo);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async create(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const body = request.body as { nombre_equipo: string; id_grupo: number };
    try {
      const nuevo = await service.create(body);
      reply.status(201).send(nuevo);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async update(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    const body = request.body as { nombre_equipo?: string };
    try {
      const updated = await service.update(id, body);
      reply.send(updated);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async delete(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const params = request.params as any;
    const id = Number(params.id);
    try {
      await service.delete(id);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async addAlumno(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const params = request.params as any;
    const equipoId = Number(params.equipoId);
    const body = request.body as { id_alumno: number };
    try {
      await service.addAlumno(equipoId, body.id_alumno);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async removeAlumno(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const repository = new EquipoRepository(supabaseClient);
    const service = new EquipoService(repository);
    const params = request.params as any;
    const equipoId = Number(params.equipoId);
    const alumnoId = Number(params.alumnoId);
    try {
      await service.removeAlumno(equipoId, alumnoId);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }
}