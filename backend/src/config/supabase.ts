import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';
import { logger } from '../utils/logger';

// ─── Supabase JS SDK Singleton Initializer ────────────────────────────────────

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const isConfigured =
    !!config.supabase.url &&
    !!config.supabase.anonKey &&
    config.supabase.url !== 'https://mock.supabase.co' &&
    config.supabase.anonKey !== 'mock_supabase_key';

  if (!isConfigured) {
    logger.info('[SUPABASE] Operating in hybrid fallback mode. Using local PostgreSQL & S3 storage.');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    logger.info('✅ Supabase client initialized successfully.');
  }

  return supabaseClient;
};

export const isSupabaseReady = (): boolean => {
  return getSupabaseClient() !== null;
};
