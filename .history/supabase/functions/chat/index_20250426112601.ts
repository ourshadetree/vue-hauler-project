// supabase/functions/chat/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  try {
    const { messages } = await req.json() as { messages: Array<{ role: string; content: string }> }
    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OpenAI key" }), { status: 500 })
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      return new Response(JSON.stringify({ error: err }), { status: 500 })
    }

    const data = await openaiRes.json()
    // echo back the entire response, or drill into data.choices[0].message if you prefer
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 })
  }
})
