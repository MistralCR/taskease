<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">TaskEase</h1>
          <nav class="hidden md:flex space-x-4 ml-8">
            <router-link to="/dashboard" class="text-gray-500 hover:text-gray-900"
              >Dashboard</router-link
            >
            <router-link to="/tasks" class="text-rose-600 font-medium">Tareas</router-link>
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

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
      <!-- Controles -->
      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6"
      >
        <div class="flex items-center space-x-4 w-full sm:w-auto">
          <div class="relative w-full sm:w-96">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar tareas..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
            <Search class="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>

          <div class="flex space-x-2">
            <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-md">
              <option value="todas">Todas</option>
              <option value="pendientes">Pendientes</option>
              <option value="completadas">Completadas</option>
            </select>

            <select v-model="priorityFilter" class="px-3 py-2 border border-gray-300 rounded-md">
              <option value="todas">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        <button
          @click="showModal = true"
          class="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto justify-center"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nueva Tarea
        </button>
      </div>

      <!-- Lista de tares. -->
      <div class="bg-white rounded-lg shadow">
        <!-- Header de la tabla -->
        <div
          class="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-gray-500"
        >
          <div class="col-span-1"></div>
          <div class="col-span-5">Tarea</div>
          <div class="col-span-2">Fecha límite</div>
          <div class="col-span-2">Prioridad</div>
          <div class="col-span-2">Acciones</div>
        </div>

        <!-- Cuerpo principal de la tabla -->
        <div v-if="filteredTasks.length === 0" class="p-8 text-center text-gray-500">
          No hay tareas disponibles
        </div>

        <div
          v-else
          v-for="task in filteredTasks"
          :key="task.id"
          class="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50"
        >
          <div class="col-span-1">
            <input
              type="checkbox"
              :checked="task.completed"
              @change="toggleTask(task)"
              class="h-4 w-4 rounded border-gray-300"
            />
          </div>
          <div class="col-span-5">
            <h3 class="font-medium">{{ task.title }}</h3>
            <p class="text-sm text-gray-500">{{ task.description }}</p>
          </div>
          <div class="col-span-2 flex items-center text-sm text-gray-500">
            <Clock class="h-4 w-4 mr-2" />
            {{ task.dueDate }}
          </div>
          <div class="col-span-2">
            <span
              :class="`px-2 py-1 text-xs font-medium rounded-full ${getPriorityClass(task.priority)}`"
            >
              {{ task.priority }}
            </span>
          </div>
          <div class="col-span-2 flex items-center space-x-2">
            <button @click="editTask(task)" class="text-rose-600 hover:text-rose-800 text-sm">
              Editar
            </button>
            <button @click="deleteTask(task)" class="text-red-600 hover:text-red-800 text-sm">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modulos de tarea -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
          <button @click="closeModal">
            <X class="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form @submit.prevent="saveTask" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              v-model="taskForm.title"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              v-model="taskForm.description"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha límite</label>
              <input
                type="date"
                v-model="taskForm.dueDate"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Prioridad</label>
              <select
                v-model="taskForm.priority"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
            >
              {{ editingTask ? 'Guardar cambios' : 'Crear tarea' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import { useRouter } from 'vue-router'
import { LogOut, Search, Plus, Clock, X } from 'lucide-vue-next'

export default {
  name: 'TasksView',
  components: {
    LogOut,
    Search,
    Plus,
    Clock,
    X,
  },
  data() {
    return {
      showModal: false,
      editingTask: null,
      searchQuery: '',
      statusFilter: 'todas',
      priorityFilter: 'todas',
      taskForm: {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Media',
        completed: false,
      },
    }
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
    filteredTasks() {
      let filtered = this.taskStore.tasks

      // Filtros por busqueda especifica.
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query),
        )
      }

      // Filtro por el estado de la tarea.
      if (this.statusFilter !== 'todas') {
        filtered = filtered.filter((task) =>
          this.statusFilter === 'completadas' ? task.completed : !task.completed,
        )
      }

      // Filtro por prioridad de la tarea.
      if (this.priorityFilter !== 'todas') {
        filtered = filtered.filter((task) => task.priority === this.priorityFilter)
      }

      return filtered
    },
  },
  methods: {
    logout() {
      this.authStore.logout()
      this.router.push('/')
    },
    getPriorityClass(priority) {
      const classes = {
        Alta: 'bg-red-100 text-red-800',
        Media: 'bg-yellow-100 text-yellow-800',
        Baja: 'bg-green-100 text-green-800',
      }
      return classes[priority] || 'bg-gray-100 text-gray-800'
    },
    toggleTask(task) {
      this.taskStore.updateTask(task.id, { completed: !task.completed })
    },
    editTask(task) {
      this.editingTask = task
      this.taskForm = { ...task }
      this.showModal = true
    },
    deleteTask(task) {
      if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        this.taskStore.deleteTask(task.id)
      }
    },
    closeModal() {
      this.showModal = false
      this.editingTask = null
      this.taskForm = {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Media',
        completed: false,
      }
    },
    saveTask() {
      if (this.editingTask) {
        this.taskStore.updateTask(this.editingTask.id, this.taskForm)
      } else {
        this.taskStore.createTask(this.taskForm)
      }
      this.closeModal()
    },
  },
}
</script>
