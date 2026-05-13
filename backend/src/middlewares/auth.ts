import { FastifyRequest, FastifyReply } from 'fastify';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export interface AuthUser {
  id: string;
  email: string;
  rol: string;
  matricula?: string;
  nombre?: string;
  apellido?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUser;
    supabaseClient?: SupabaseClient;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'No autorizado', message: 'Token no proporcionado' });
  }

  const token = authHeader.substring(7);

  // Crear cliente Supabase con el token del usuario para respetar RLS
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  request.supabaseClient = supabaseClient;

  // Verificar token con Supabase Auth
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  if (error || !user) {
    return reply.status(401).send({ error: 'No autorizado', message: 'Token inválido' });
  }

  // Obtener rol y datos desde la tabla 'usuarios' usando el mismo cliente autenticado
  const { data: usuarioData, error: roleError } = await supabaseClient
    .from('usuarios')
    .select('rol, nombre, apellido, matricula')
    .eq('id_usuario', user.id)
    .single();

  if (roleError) {
    return reply.status(403).send({ error: 'Forbidden', message: 'Usuario sin rol asignado' });
  }

  request.user = {
    id: user.id,
    email: user.email!,
    rol: usuarioData.rol,
    matricula: usuarioData.matricula,
    nombre: usuarioData.nombre,
    apellido: usuarioData.apellido,
  };
}