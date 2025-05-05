// supabase/functions/_shared/cors.ts
export const corsHeaders = {
    // allow any origin (change to your domain in prod)
    "Access-Control-Allow-Origin": "*",
    // preflight must allow OPTIONS
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    // include every header supabase-js will send (x-client-info, apikey, etc.)
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
  