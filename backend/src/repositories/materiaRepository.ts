import { SupabaseClient } from '@supabase/supabase-js';

export class MateriaRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAll(page: number, size: number, nombre?: string) {
    let query = this.supabase
      .from('materias')
      .select('*', { count: 'exact' })
      .range(page * size, (page + 1) * size - 1);

    if (nombre) {
      query = query.ilike('nombre_materia', `%${nombre}%`);
    }
    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, total: count || 0 };
  }

  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('materias')
      .select('*')
      .eq('id_materia', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(materia: { clave_materia: string; nombre_materia: string }) {
    const { data, error } = await this.supabase
      .from('materias')
      .insert(materia)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: number, materia: { clave_materia?: string; nombre_materia?: string }) {
    const { data, error } = await this.supabase
      .from('materias')
      .update(materia)
      .eq('id_materia', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: number) {
    const { error } = await this.supabase.from('materias').delete().eq('id_materia', id);
    if (error) throw new Error(error.message);
  }
}