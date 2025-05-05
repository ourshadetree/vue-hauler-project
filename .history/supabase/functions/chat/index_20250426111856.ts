import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "openai";

const ai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  const { messages } = await req.json();

  // call OpenAI
  const resp = await ai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return new Response(JSON.stringify(resp), {
    headers: { "Content-Type": "application/json" },
  });
});
