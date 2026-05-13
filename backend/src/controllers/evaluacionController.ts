import { FastifyRequest, FastifyReply } from 'fastify';
import { SupabaseClient } from '@supabase/supabase-js';
import { EvaluacionRepository } from '../repositories/evaluacionRepository';
import { ExposicionRepository } from '../repositories/exposicionRepository';
import { CriterioRepository } from '../repositories/criterioRepository';
import { AlumnoRepository } from '../repositories/alumnoRepository';
import { EvaluacionService } from '../services/evaluacionService';

export class EvaluacionController {
  async registrar(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const evaluacionRepo = new EvaluacionRepository(supabaseClient);
    const exposicionRepo = new ExposicionRepository(supabaseClient);
    const criterioRepo = new CriterioRepository(supabaseClient);
    const alumnoRepo = new AlumnoRepository(supabaseClient);
    const service = new EvaluacionService(evaluacionRepo, exposicionRepo, criterioRepo, alumnoRepo);
    const body = request.body as any;
    const { id_exposicion, id_alumno_evaluador, detalles, comentario_general } = body;
    const currentUser = (request as any).user;

    try {
      const userIdFromAlumno = await this.getUserIdFromAlumno(alumnoRepo, id_alumno_evaluador);
      if (currentUser?.rol !== 'admin' && currentUser?.id !== userIdFromAlumno) {
        return reply.status(403).send({ error: 'No puede evaluar en nombre de otro alumno' });
      }
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }

    try {
      const result = await service.registrarEvaluacion(
        id_exposicion,
        id_alumno_evaluador,
        detalles,
        comentario_general
      );
      reply.status(201).send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  async listByExposicion(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const evaluacionRepo = new EvaluacionRepository(supabaseClient);
    const exposicionRepo = new ExposicionRepository(supabaseClient);
    const criterioRepo = new CriterioRepository(supabaseClient);
    const alumnoRepo = new AlumnoRepository(supabaseClient);
    const service = new EvaluacionService(evaluacionRepo, exposicionRepo, criterioRepo, alumnoRepo);
    const params = request.params as any;
    const id = Number(params.idExposicion);
    try {
      const evaluaciones = await service.obtenerEvaluacionesPorExposicion(id);
      reply.send(evaluaciones);
    } catch (error: any) {
      reply.status(404).send({ error: error.message });
    }
  }

  async obtenerEvaluacionPropia(supabaseClient: SupabaseClient, request: FastifyRequest, reply: FastifyReply) {
    const evaluacionRepo = new EvaluacionRepository(supabaseClient);
    const exposicionRepo = new ExposicionRepository(supabaseClient);
    const criterioRepo = new CriterioRepository(supabaseClient);
    const alumnoRepo = new AlumnoRepository(supabaseClient);
    const service = new EvaluacionService(evaluacionRepo, exposicionRepo, criterioRepo, alumnoRepo);
    const params = request.params as any;
    const exposicionId = Number(params.idExposicion);
    const currentUserId = (request as any).user?.id;
    if (!currentUserId) return reply.status(401).send({ error: 'No autenticado' });
    const alumnoId = await this.getAlumnoIdByUserId(alumnoRepo, currentUserId);
    if (!alumnoId) {
      return reply.status(404).send({ error: 'Perfil de alumno no encontrado' });
    }
    try {
      const evaluacion = await service.obtenerEvaluacionPropia(exposicionId, alumnoId);
      reply.send(evaluacion || { message: 'Aún no has evaluado esta exposición' });
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  private async getUserIdFromAlumno(alumnoRepo: AlumnoRepository, alumnoId: number): Promise<string> {
    const alumno = await alumnoRepo.findById(alumnoId);
    if (!alumno) throw new Error(`Alumno con id ${alumnoId} no encontrado`);
    if (!alumno.id_usuario) throw new Error(`El alumno ${alumnoId} no tiene una cuenta de usuario vinculada`);
    return alumno.id_usuario;
  }

  private async getAlumnoIdByUserId(alumnoRepo: AlumnoRepository, userId: string): Promise<number | null> {
    const alumno = await alumnoRepo.findByUsuarioId(userId);
    return alumno ? alumno.id_alumno : null;
  }
}