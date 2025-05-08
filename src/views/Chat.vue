<template>
    <div class="flex flex-col h-screen bg-gradient-to-b from-[#0e1525] to-[#0a0f1d] text-white">
      <!-- Header -->
      <header class="flex items-center justify-between px-4 py-2 bg-[#0c1220] shadow">
        <div class="flex items-center space-x-2">
          <img src="https://files.readme.io/53a4119-small-logo-bankly-white.png" class="h-6" />
        </div>

        <button
          @click="$router.push('/documentacao')"
          class="flex items-center gap-2 bg-[#1c2332] hover:bg-[#283045] text-white text-sm font-medium px-4 py-2 rounded-full shadow transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 4h8m4 0v2a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2h12a2 2 0 012 2v12z" />
          </svg>
          📄 Gerador de Documentação
        </button>

        <span class="text-sm text-gray-300">💬 Assistente Técnico</span>  
      </header>
  
      <!-- Chat Area -->
      <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex flex-col"
          :class="msg.sender === 'user' ? 'items-end' : 'items-start'"
        >
          <div
            class="max-w-[85%] rounded-xl px-4 py-3 text-sm shadow-md break-words"
            :class="msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-[#1e2a3a] text-white'"
          >
            <span v-if="msg.typing" class="flex gap-1 animate-pulse">
              <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
              <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
              <span class="w-2 h-2 bg-gray-300 rounded-full"></span>
            </span>
            <span v-else v-html="formatMessage(msg.text)"></span>
          </div>
          <span class="text-xs text-gray-400 mt-1">{{ formatTime(msg.timestamp) }}</span>
        </div>
      </main>
  
      <!-- Input -->
      <footer class="fixed bottom-0 left-0 right-0 px-4 py-3 bg-[#0c1220]">
        <div class="flex items-center gap-2">
          <input
            v-model="question"
            @keyup.enter="sendMessage"
            placeholder="Digite sua pergunta..."
            class="flex-1 px-4 py-2 rounded-full border border-gray-600 bg-[#1c2332] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="sendMessage"
            class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        question: '',
        messages: [],
        loading: false
      }
    },
    methods: {
      async sendMessage() {
        if (!this.question) return
  
        const userMessage = { sender: 'user', text: this.question, timestamp: new Date() }
        this.messages.push(userMessage)
  
        this.loading = true
        const typingMessage = {
          sender: 'bot',
          text: '',
          typing: true,
          timestamp: new Date()
        }
        this.messages.push(typingMessage)
  
        this.$nextTick(() => this.scrollToBottom())
  
        try {
          const response = await axios.post(
            'https://MINHA_URL/ask',
            { question: this.question }
          )
  
          this.messages.pop() // remove typing
          const reply = response.data?.resposta || 'Erro ao processar resposta.'
          this.messages.push({ sender: 'bot', text: reply, timestamp: new Date() })
        } catch (error) {
          this.messages.pop()
          this.messages.push({ sender: 'bot', text: 'Erro ao chamar API.', timestamp: new Date() })
        }
  
        this.question = ''
        this.$nextTick(() => this.scrollToBottom())
      },
      formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      formatMessage(message) {
        let msg = message
                    .replace(/\[```]./g, '')
                    .replace(/\n/g, '<br />');
  
        console.log(msg);
  
        return msg;
      },
      scrollToBottom() {
        const container = this.$refs.chatContainer
        if (container) {
          setTimeout(() => {
            container.scrollTop = container.scrollHeight
          }, 100)
        }
      }
    }
  }
  </script>
  
  <style>
  html, body, #app {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #0e1525;
  }
  
  body {
    @apply bg-[#0e1525];
  }
  </style>
  