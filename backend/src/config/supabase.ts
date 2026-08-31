import { config } from './env';
import { logger } from '../utils/logger';

// ─── Supabase Client Config & Mock Initializer ────────────────────────────────

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const isConfigured =
    !!config.supabase.url &&
    !!config.supabase.anonKey &&
    config.supabase.url !== 'https://mock.supabase.co' &&
    config.supabase.anonKey !== 'mock_supabase_key';

  if (!isConfigured) {
    logger.info('[SUPABASE] Supabase credentials not set or mock. Operating in hybrid/local fallback mode.');
  }

  return {
    url: config.supabase.url,
    anonKey: config.supabase.anonKey,
    isConfigured,
  };
};
