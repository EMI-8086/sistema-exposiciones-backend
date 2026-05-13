import { SupabaseClient } from '@supabase/supabase-js';

export class AlumnoRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(page: number, size: number, search?: string) {
    let query = this.supabase
      .from('alumnos')
      .select('*, usuarios(email, rol)', { count: 'exact' })
      .range(page * size, (page + 1) * size - 1);
    if (search) {
      query = query.or(`matricula.ilike.%${search}%,nombre.ilike.%${search}%,apellido.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, total: count || 0 };
  }

  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('alumnos')
      .select('*, usuarios(email, rol)')
      .eq('id_alumno', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findByUsuarioId(usuarioId: string) {
    const { data, error } = await this.supabase
      .from('alumnos')
      .select('*')
      .eq('id_usuario', usuarioId)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  async create(alumno: { matricula: string; nombre: string; apellido: string; email: string; id_usuario?: string }) {
    const { data, error } = await this.supabase
      .from('alumnos')
      .insert(alumno)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: number, alumno: { matricula?: string; nombre?: string; apellido?: string; email?: string }) {
    const { data, error } = await this.supabase
      .from('alumnos')
      .update(alumno)
      .eq('id_alumno', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: number) {
    const { error } = await this.supabase.from('alumnos').delete().eq('id_alumno', id);
    if (error) throw new Error(error.message);
  }
}