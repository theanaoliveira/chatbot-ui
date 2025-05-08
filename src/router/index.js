import { createRouter, createWebHistory } from 'vue-router'
import ChatView from '../views/Chat.vue'
import DocGenerator from '../views/DocGenerator.vue'

const routes = [
  { path: '/', component: ChatView },
  { path: '/documentacao', component: DocGenerator }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
