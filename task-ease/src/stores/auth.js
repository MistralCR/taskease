/* // Este archivo contiene la lógica de autenticación de la aplicación. Se encarga de registrar, 
iniciar sesión y cerrar sesión de los usuarios. También verifica si el usuario está autenticado al cargar la aplicación. */
//NO TOCAR ESTE ARCHIVO
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  actions: {
    register(userData) {
      try {
        // Obtiene los usuarios existentes o inicializar un nuevo arraya.
        const users = JSON.parse(localStorage.getItem('users')) || []

        // Linea que verifica que el usuario ya existe.
        const userExists = users.some((user) => user.username === userData.username)
        if (userExists) {
          throw new Error('El usuario ya existe')
        }

        // Esta linea se usa para agregar nuevo usuario y guardar en localStorage.
        const newUsers = [...users, userData]
        localStorage.setItem('users', JSON.stringify(newUsers))

        return true
      } catch (error) {
        console.error('Error en registro:', error)
        throw error
      }
    },

    login(credentials) {
      try {
        const users = JSON.parse(localStorage.getItem('users')) || []
        const user = users.find(
          (u) => u.username === credentials.username && u.password === credentials.password,
        )

        if (!user) {
          throw new Error('Credenciales inválidas')
        }

        // Guarda la sesión.
        this.user = user
        this.isAuthenticated = true
        localStorage.setItem('currentUser', JSON.stringify(user))

        return true
      } catch (error) {
        console.error('Error en login:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('currentUser')
    },

    checkAuth() {
      const user = JSON.parse(localStorage.getItem('currentUser'))
      if (user) {
        this.user = user
        this.isAuthenticated = true
      }
    },
  },
})
