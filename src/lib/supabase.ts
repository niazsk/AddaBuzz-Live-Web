import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_INFO = {
  projectId: 'citiaagytdkomcmkuhkk',
  projectName: 'AddaBuzz Live',
  region: 'ap-northeast-2',
  defaultUrl: 'https://citiaagytdkomcmkuhkk.supabase.co',
  defaultAnonKey: 'sb_publishable_84NpiaDV0dfaFOWFbTFdwA_AKFby-Lo',
};

const STORAGE_KEY_URL = 'addabuzz_supabase_url';
const STORAGE_KEY_ANON = 'addabuzz_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
  projectId: string;
  region: string;
}

/**
 * Retrieve current Supabase config from environment variables or localStorage
 */
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) : null;
  const localAnon = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_ANON) : null;

  const url = localUrl || (envUrl && envUrl !== 'https://your-project.supabase.co' ? envUrl : SUPABASE_PROJECT_INFO.defaultUrl);
  const anonKey = localAnon || (envAnon && envAnon !== 'your-anon-public-key' ? envAnon : SUPABASE_PROJECT_INFO.defaultAnonKey);

  return {
    url: url || SUPABASE_PROJECT_INFO.defaultUrl,
    anonKey: anonKey || SUPABASE_PROJECT_INFO.defaultAnonKey,
    isCustom: Boolean(localUrl || localAnon),
    projectId: SUPABASE_PROJECT_INFO.projectId,
    region: SUPABASE_PROJECT_INFO.region,
  };
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey && config.url.startsWith('https://'));
}

/**
 * Persist custom Supabase configuration to browser localStorage
 */
export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!url || !anonKey) {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
    cachedClient = null;
    return false;
  }

  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  cachedClient = null;
  return true;
}

export function clearSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_ANON);
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

/**
 * Get or initialize the Supabase client
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test connectivity with Supabase project
 */
export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string; details?: any }> {
  const targetUrl = url || getSupabaseConfig().url;
  const targetKey = anonKey || getSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: 'Supabase URL and Anon Key are missing.',
    };
  }

  try {
    const testClient = createClient(targetUrl, targetKey);
    // Ping public auth settings / session
    const { data, error } = await testClient.auth.getSession();
    
    if (error && error.message.includes('Invalid API key')) {
      return {
        success: false,
        message: 'Invalid Supabase Anon Public Key. Please check the API key.',
        details: error,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase project!',
      details: data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to connect to Supabase.',
      details: err,
    };
  }
}
