// Filtra las tareas del usuario en uso.
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
  }),

  getters: {
    totalTasks: (state) => state.tasks.length,

    completedTasks: (state) => state.tasks.filter((task) => task.completed).length,

    pendingTasks: (state) => state.tasks.filter((task) => !task.completed).length,

    upcomingTasks: (state) => {
      const today = new Date()
      const nextWeek = new Date()
      nextWeek.setDate(today.getDate() + 7)

      return state.tasks.filter((task) => {
        const dueDate = new Date(task.dueDate)
        return !task.completed && dueDate >= today && dueDate <= nextWeek
      }).length
    },

    recentActivity: (state) => {
      return [...state.tasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    },
  },

  actions: {
    createTask(taskData) {
      try {
        // Obtiene las tareas existentes o inicialisa un nuevo arraya.
        const currentTasks = JSON.parse(localStorage.getItem('tasks')) || []

        // Crea una nueva tarea con ID unico con su repectiva fecha de creación.
        const newTask = {
          id: Date.now(),
          ...taskData,
          createdAt: new Date().toISOString(),
          userId: JSON.parse(localStorage.getItem('currentUser')).username,
        }

        currentTasks.push(newTask)

        // Guardar en alamacenamiento local.
        localStorage.setItem('tasks', JSON.stringify(currentTasks))

        // Actualiza el estado.
        this.tasks = currentTasks
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },

    loadTasks() {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        const allTasks = JSON.parse(localStorage.getItem('tasks')) || []

        // Filtrar las tareas del usuario en uso.
        this.tasks = allTasks.filter((task) => task.userId === currentUser.username)
      } catch (error) {
        console.error('Error loading tasks:', error)
        this.tasks = []
      }
    },

    updateTask(taskId, updateData) {
      try {
        let allTasks = JSON.parse(localStorage.getItem('tasks')) || []

        // Actualiza la tarea actual.
        allTasks = allTasks.map((task) => (task.id === taskId ? { ...task, ...updateData } : task))

        // Guarda en el almacenamiento local.

        localStorage.setItem('tasks', JSON.stringify(allTasks))

        // Actualiza el estado.
        this.loadTasks()
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },

    deleteTask(taskId) {
      try {
        let allTasks = JSON.parse(localStorage.getItem('tasks')) || []

        // Filtra la tarea que se debe eliminar.
        allTasks = allTasks.filter((task) => task.id !== taskId)

        // Guardar nuevamente en disco local.
        localStorage.setItem('tasks', JSON.stringify(allTasks))

        // Actualiza el estado actual.
        this.loadTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    },
  },
})
