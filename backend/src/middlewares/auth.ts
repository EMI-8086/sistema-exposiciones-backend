import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../config/supabase';

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
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'No autorizado', message: 'Token no proporcionado' });
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return reply.status(401).send({ error: 'No autorizado', message: 'Token inválido' });
  }

  // Obtener rol y datos desde tabla usuarios
  const { data: usuarioData, error: roleError } = await supabase
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