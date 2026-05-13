//validacion de variables de entorno
import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'PORT'];
for (const env of requiredEnv) {
  if (!process.env[env]) throw new Error(`Missing env: ${env}`);
}

export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PORT: parseInt(process.env.PORT || '8080'),
};