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
          placeholder="Ask me anything…"
          autocomplete="off"
        />
        <button :disabled="loading">➤</button>
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
    if (!prompt.value.trim()) return
    // push user message
    messages.value.push({ from: 'user', text: prompt.value })
    loading.value = true
  
    try {
      // 2) build the OpenAI‐style messages array
    const chatHistory = messages.value.map(m => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text
    }))

    // 3) invoke your Supabase Function named "chat"
    const { data, error } = await supabase
      .functions
      .invoke('chat', {
        body: JSON.stringify({ messages: chatHistory })
      })

    if (error) throw error

    // 4) extract the assistant’s reply (depends on your function’s response shape)
    const reply = data.choices?.[0]?.message?.content ?? '😞 No response.'
    messages.value.push({ from: 'assistant', text: reply })
    } catch (e) {
      messages.value.push({ from: 'assistant', text: '😞 Something went wrong.' })
      console.error(e)
    } finally {
      prompt.value = ''
      loading.value = false
      // auto-scroll to bottom
      nextTick(() => {
        const c = document.querySelector('.chat-assistant .messages')
        c.scrollTop = c.scrollHeight
      })
    }
  }
  </script>
  
  <style scoped>
  .chat-assistant {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    width: 280px;
    max-height: 400px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
    z-index: 1000;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }
  .message {
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 4px;
  }
  .message.user {
    background: #f0f0f0;
    align-self: flex-end;
  }
  .message.assistant {
    background: #b11818;
    color: white;
    align-self: flex-start;
  }
  .input-bar {
    display: flex;
    border-top: 1px solid #eee;
  }
  .input-bar input {
    flex: 1;
    border: none;
    padding: 0.5rem;
  }
  .input-bar button {
    border: none;
    background: #b11818;
    color: white;
    width: 48px;
    cursor: pointer;
  }
  .input-bar button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  </style>
  