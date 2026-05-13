import { SupabaseClient } from '@supabase/supabase-js';

export class EvaluacionRepository {
  constructor(private supabase: SupabaseClient) {}

  async create(evaluacion: { id_exposicion: number; id_alumno_evaluador: number; comentario_general?: string }) {
    const { data, error } = await this.supabase
      .from('evaluaciones')
      .insert(evaluacion)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async addDetalle(detalle: { id_evaluacion: number; id_criterio: number; calificacion: number }) {
    const { error } = await this.supabase.from('detalle_evaluacion').insert(detalle);
    if (error) throw new Error(error.message);
  }

  async findByExposicion(exposicionId: number) {
    const { data, error } = await this.supabase
      .from('evaluaciones')
      .select('*, detalle_evaluacion(*, criterios(*))')
      .eq('id_exposicion', exposicionId);
    if (error) throw new Error(error.message);
    return data;
  }

  async findByAlumnoEvaluador(exposicionId: number, alumnoEvaluadorId: number) {
    const { data, error } = await this.supabase
      .from('evaluaciones')
      .select('*')
      .eq('id_exposicion', exposicionId)
      .eq('id_alumno_evaluador', alumnoEvaluadorId)
      .maybeSingle();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }
}