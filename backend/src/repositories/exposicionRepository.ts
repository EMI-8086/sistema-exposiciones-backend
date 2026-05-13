import { SupabaseClient } from '@supabase/supabase-js';

export class ExposicionRepository {
  constructor(private supabase: SupabaseClient) {}

  async findAllByEquipo(equipoId: number, page: number, size: number) {
    const { data, error, count } = await this.supabase
      .from('exposiciones')
      .select('*')
      .eq('id_equipo', equipoId)
      .range(page * size, (page + 1) * size - 1);
    if (error) throw new Error(error.message);
    return { data, total: count || 0 };
  }

  async findById(id: number) {
    const { data, error } = await this.supabase
      .from('exposiciones')
      .select('*, equipos(*, grupos(*, materias(*)))')
      .eq('id_exposicion', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async create(exposicion: { titulo: string; fecha_exposicion: string; id_equipo: number; rubrica?: any }) {
    const { data, error } = await this.supabase
      .from('exposiciones')
      .insert(exposicion)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: number, exposicion: { titulo?: string; fecha_exposicion?: string; rubrica?: any }) {
    const { data, error } = await this.supabase
      .from('exposiciones')
      .update(exposicion)
      .eq('id_exposicion', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: number) {
    const { error } = await this.supabase.from('exposiciones').delete().eq('id_exposicion', id);
    if (error) throw new Error(error.message);
  }
}