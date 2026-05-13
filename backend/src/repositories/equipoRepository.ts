import { SupabaseClient } from '@supabase/supabase-js';

export class EquipoRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAllByGrupo(grupoId: number, page: number, size: number) {
    const { data, error, count } = await this.supabase
      .from('equipos')
      .select('*, equipo_alumno(alumnos(*))', { count: 'exact' })
      .eq('id_grupo', grupoId)
      .range(page * size, (page + 1) * size - 1);
    if (error) throw new Error(error.message);
    return { data, total: count || 0 };
  }

  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('equipos')
      .select('*, equipo_alumno(alumnos(*))')
      .eq('id_equipo', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(equipo: { nombre_equipo: string; id_grupo: number }) {
    const { data, error } = await this.supabase
      .from('equipos')
      .insert(equipo)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: number, equipo: { nombre_equipo?: string }) {
    const { data, error } = await this.supabase
      .from('equipos')
      .update(equipo)
      .eq('id_equipo', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: number) {
    const { error } = await this.supabase.from('equipos').delete().eq('id_equipo', id);
    if (error) throw new Error(error.message);
  }

  async addAlumno(equipoId: number, alumnoId: number) {
    const { error } = await this.supabase
      .from('equipo_alumno')
      .insert({ id_equipo: equipoId, id_alumno: alumnoId });
    if (error) throw new Error(error.message);
  }

  async removeAlumno(equipoId: number, alumnoId: number) {
    const { error } = await this.supabase
      .from('equipo_alumno')
      .delete()
      .eq('id_equipo', equipoId)
      .eq('id_alumno', alumnoId);
    if (error) throw new Error(error.message);
  }
}