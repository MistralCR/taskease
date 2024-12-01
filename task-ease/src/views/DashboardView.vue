// Vista para el dashboard de la aplicacion.
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de la seccion -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">TaskEase</h1>
          <nav class="hidden md:flex space-x-4 ml-8">
            <router-link to="/dashboard" class="text-rose-600 font-medium">Dashboard</router-link>
            <router-link to="/tasks" class="text-gray-500 hover:text-gray-900">Tareas</router-link>
          </nav>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">¡Hola, {{ username }}!</span>
          <button @click="logout" class="text-gray-600 hover:text-gray-900">
            <LogOut class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Tareas</p>
              <h3 class="text-2xl font-bold">{{ taskStore.totalTasks }}</h3>
            </div>
            <ClipboardList class="text-gray-400 h-6 w-6" />
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Completadas</p>
              <h3 class="text-2xl font-bold text-green-600">{{ taskStore.completedTasks }}</h3>
            </div>
            <CheckCircle class="text-green-600 h-6 w-6" />
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Pendientes</p>
              <h3 class="text-2xl font-bold text-orange-600">{{ taskStore.pendingTasks }}</h3>
            </div>
            <Clock class="text-orange-600 h-6 w-6" />
          </div>
        </div>

        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Próximas a vencer</p>
              <h3 class="text-2xl font-bold text-red-600">{{ taskStore.upcomingTasks }}</h3>
            </div>
            <AlertTriangle class="text-red-600 h-6 w-6" />
          </div>
        </div>
      </div>

      <!-- Muestra la actividad reciente -->
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-medium mb-4">Actividad Reciente</h3>
        <div class="space-y-4">
          <div v-if="taskStore.recentActivity.length === 0" class="text-center text-gray-500 py-4">
            No hay actividad reciente
          </div>
          <div
            v-else
            v-for="task in taskStore.recentActivity"
            :key="task.id"
            class="flex items-center space-x-4 py-2 border-b last:border-0"
          >
            <div class="flex-1">
              <h4 class="font-medium">{{ task.title }}</h4>
              <p class="text-sm text-gray-500">Creada {{ formatDate(task.createdAt) }}</p>
            </div>
            <span :class="task.completed ? 'text-green-600' : 'text-orange-600'">
              <component :is="task.completed ? CheckCircle : Clock" class="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useRouter } from 'vue-router'
import { LogOut, CheckCircle, Clock, AlertTriangle, ClipboardList } from 'lucide-vue-next'

export default {
  name: 'DashboardView',
  components: {
    LogOut,
    CheckCircle,
    Clock,
    AlertTriangle,
    ClipboardList,
  },
  setup() {
    const authStore = useAuthStore()
    const taskStore = useTaskStore()
    const router = useRouter()

    return {
      authStore,
      taskStore,
      router,
    }
  },
  mounted() {
    this.taskStore.loadTasks()
  },
  computed: {
    username() {
      return this.authStore.user?.name || this.authStore.user?.username || 'Usuario'
    },
  },
  methods: {
    logout() {
      this.authStore.logout()
      this.router.push('/')
    },
    formatDate(date) {
      const taskDate = new Date(date)
      const now = new Date()
      const diffTime = Math.abs(now - taskDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'hoy'
      if (diffDays === 1) return 'ayer'
      return `hace ${diffDays} días`
    },
  },
}
</script>
