// Vista de autenticación para iniciar sesión y registrarse.
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
      <!-- Logo y Titulo -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">TaskEase</h1>
        <p class="text-gray-500 text-sm">
          {{ isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta' }}
        </p>
      </div>

      <!-- Formulario del usuario -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700 block"> Username </label>
            <input
              type="text"
              v-model="formData.username"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
              placeholder="Ingresa tu username"
              required
            />
          </div>

          <div v-if="!isLogin">
            <label class="text-sm font-medium text-gray-700 block"> Nombre </label>
            <input
              type="text"
              v-model="formData.name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 block"> Contraseña </label>
            <input
              type="password"
              v-model="formData.password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
        </button>
      </form>

      <!-- Login o Registrar -->
      <div class="text-center">
        <button @click="toggleAuthMode" class="text-sm text-rose-600 hover:text-rose-500">
          {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'AuthView',
  data() {
    return {
      isLogin: true,
      formData: {
        username: '',
        password: '',
        name: '',
      },
      error: '',
    }
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    return {
      router,
      authStore,
    }
  },
  methods: {
    toggleAuthMode() {
      this.isLogin = !this.isLogin
      this.formData = {
        username: '',
        password: '',
        name: '',
      }
      this.error = ''
    },
    async handleSubmit() {
      try {
        if (this.isLogin) {
          await this.authStore.login({
            username: this.formData.username,
            password: this.formData.password,
          })
        } else {
          await this.authStore.register(this.formData)
          await this.authStore.login({
            username: this.formData.username,
            password: this.formData.password,
          })
        }

        // Redirige al dashboard despues de iniciar la sesion
        this.router.push('/dashboard')
      } catch (err) {
        this.error = err.message
      }
    },
  },
}
</script>
