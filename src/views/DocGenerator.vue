<template>
    <div class="flex flex-col h-screen bg-gradient-to-b from-[#0e1525] to-[#0a0f1d] text-white">
      <!-- Header -->
      <header class="flex items-center justify-between px-4 py-2 bg-[#0c1220] shadow">
        <div class="flex items-center space-x-2">
          <img src="https://files.readme.io/53a4119-small-logo-bankly-white.png" class="h-6" />
        </div>
        <div class="flex items-center space-x-4">
          <button
            @click="$router.push('/')"
            class="flex items-center gap-2 bg-[#1c2332] hover:bg-[#283045] text-white text-sm font-medium px-4 py-2 rounded-full shadow transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h6m-6 4h8m4 0v2a2 2 0 01-2 2H7l-4 4V6a2 2 0 012-2h12a2 2 0 012 2v12z" />
            </svg>
            Chatbot
          </button>

          <span class="text-sm text-gray-300">📄 Gerador de Documentação</span>
        </div>
      </header>
  
      <!-- Upload Area -->
      <main class="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col items-center justify-center">
        <label class="text-gray-300 mb-2">Selecione o arquivo Swagger (.json):</label>

        <label class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow cursor-pointer mb-4">
          Escolher Arquivo
          <input
            type="file"
            accept="application/json"
            @change="handleFileUpload"
            class="hidden"
          />
        </label>

        <p v-if="selectedFile" class="text-sm text-gray-400 mt-[-1rem]">{{ selectedFile.name }}</p>
  
        <button
          @click="generateDoc"
          :disabled="!selectedFile || loading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          {{ loading ? 'Gerando...' : 'Gerar Documentação' }}
        </button>
  
        <div v-if="downloadLink" class="mt-6 text-center">
          <p class="mb-2 text-green-400">Documentação gerada com sucesso!</p>
          <a
            :href="downloadLink"
            download="documentacao-gerada.md"
            class="flex justify-center items-center gap-2 bg-[#1c2332] hover:bg-[#283045] text-blue-400 px-6 py-2 rounded-full shadow transition duration-200 w-full max-w-xs text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            Baixar Markdown
          </a>
        </div>
        <div v-if="markdownPreview" class="mt-6 w-full max-w-3xl p-4 bg-[#1e2a3a] rounded-xl shadow text-sm whitespace-pre-wrap overflow-x-auto">
          {{ markdownPreview }}
        </div>
  
        <div v-if="errorMessage" class="mt-6 text-red-400">
          {{ errorMessage }}
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        selectedFile: null,
        downloadLink: '',
        errorMessage: '',
        loading: false,
        markdownPreview: ''
      }
    },
    methods: {
      handleFileUpload(event) {
        this.selectedFile = event.target.files[0]
        this.downloadLink = ''
        this.errorMessage = ''
      },
      async generateDoc() {
        if (!this.selectedFile) return
  
        this.loading = true
        this.downloadLink = ''
        this.errorMessage = ''
  
        const formData = new FormData()
        formData.append('file', this.selectedFile)
  
        try {
          const response = await axios.post('https://MINHA_URL/generate-doc', formData, {
            responseType: 'blob'
          })
          
          const text = await response.data.text()

          const blob = new Blob([text], { type: 'text/markdown' })
          this.downloadLink = URL.createObjectURL(blob)
          this.markdownPreview = text
        } catch (error) {
          console.error('Erro na geração:', error.response || error.message || error)
          this.errorMessage = 'Erro ao gerar a documentação. Verifique o Swagger.'
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  input[type='file']::-webkit-file-upload-button {
    background: #1c2332;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
  }
  </style>  