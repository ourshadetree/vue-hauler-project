// functions/chat/index.ts

// Built-in types for the edge runtime
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { messages } = await req.json()
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Request body must be { messages: [...] }" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Call OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      return new Response(
        JSON.stringify({ error: "OpenAI error", details: err }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      )
    }

    const payload = await openaiRes.json()
    // Just return the whole completion object, or pluck out payload.choices[0].message
    return new Response(JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
