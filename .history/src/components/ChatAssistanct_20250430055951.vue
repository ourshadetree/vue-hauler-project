<template>
  <div class="chat-assistant">
    <div class="messages">
      <div 
        v-for="(m,i) in messages" 
        :key="i" 
        :class="['message', m.from]"
      >
        {{ m.text }}
      </div>
    </div>
    <form @submit.prevent="send" class="input-bar">
      <input
        v-model="prompt"
        @keyup.enter="send"
        placeholder="Ask me anything…"
        autocomplete="off"
      />
      <!-- explicitly mark this as a submit button -->
      <button type="submit" :disabled="loading">➤</button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { supabase } from '@/supabaseClient'

const messages = ref([
  { from: 'assistant', text: 'Hi there! How can I help you today?' }
])
const prompt = ref('')
const loading = ref(false)

async function send() {
  console.log('[ChatAssistant] 🔥 send() called with prompt:', `"${prompt.value}"`)
  if (!prompt.value.trim()) {
    console.log('[ChatAssistant] 🛑 prompt empty, aborting')
    return
  }

  // 1) show the user’s message
  messages.value.push({ from: 'user', text: prompt.value })
  loading.value = true

  try {
    // 2) build the OpenAI‐style history
    const chatHistory = messages.value.map(m => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text
    }))
    console.log('[ChatAssistant] 📡 calling supabase.functions.invoke…')

    // 3) invoke your Edge Function
    const { data, error } = await supabase
      .functions
      .invoke('chat', {
        body: JSON.stringify({ messages: chatHistory })
      })

    if (error) throw error
    console.log('[ChatAssistant] ✅ got data back:', data)

    // 4) display the assistant’s reply
    const reply = data.choices?.[0]?.message?.content ?? '😞 No response.'
    messages.value.push({ from: 'assistant', text: reply })
  } catch (e) {
    console.error('[ChatAssistant] 💥 error in send():', e)
    messages.value.push({ from: 'assistant', text: '😞 Something went wrong.' })
  } finally {
    // 5) always clear + reset
    prompt.value = ''
    loading.value = false
    nextTick(() => {
      const c = document.querySelector('.chat-assistant .messages')
      c.scrollTop = c.scrollHeight
    })
  }
}
</script>
