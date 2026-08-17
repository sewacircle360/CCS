import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://vigvrljkutttoevsopus.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_mj6it5hE2s2pVGQxHC0qyw_XobdX5M6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
