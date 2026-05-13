import { SupabaseClient } from '@supabase/supabase-js';

export class GrupoRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAllByMateria(materiaId: number, page: number, size: number) {
    const { data, error, count } = await this.supabase
      .from('grupos')
      .select('*, materias(*)', { count: 'exact' })
      .eq('id_materia', materiaId)
      .range(page * size, (page + 1) * size - 1);
    if (error) throw new Error(error.message);
    return { data, total: count || 0 };
  }

  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('grupos')
      .select('*, materias(*)')
      .eq('id_grupo', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(grupo: { nombre_grupo: string; periodo: string; id_materia: number }) {
    const { data, error } = await this.supabase
      .from('grupos')
      .insert(grupo)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: number, grupo: { nombre_grupo?: string; periodo?: string; id_materia?: number }) {
    const { data, error } = await this.supabase
      .from('grupos')
      .update(grupo)
      .eq('id_grupo', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: number) {
    const { error } = await this.supabase.from('grupos').delete().eq('id_grupo', id);
    if (error) throw new Error(error.message);
  }
}