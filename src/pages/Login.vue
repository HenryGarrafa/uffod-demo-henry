<template>
  <div class="login-page">
    <h2>Login</h2>
    <div class="login-form">
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button class="login-button">Login</button>
      </form>
    </div>

    <div class="register-section">
      <p>Don't have an account?</p>
      <button class="register-button" @click="goToRegister">Register</button>
    </div>
  </div>
</template>

<script>
import { getUserInfo, login, getUserFavoriteLists } from '@/services/authService.js'
import { useUserStore } from '@/stores/userStore.js'

export default {
  components: {},
  data() {
    return {
      email: '',
      password: '',
      isLoggingIn: false,
    }
  },
  methods: {
    async handleLogin() {
      if (this.isLoggingIn) return
      this.isLoggingIn = true
      try {
        await login(this.email, this.password)

        const userData = await getUserInfo()
        localStorage.setItem('user', JSON.stringify(userData))

        const favoriteData = await getUserFavoriteLists()
        if (favoriteData.length > 0) {
          localStorage.setItem('selectedFavoriteListId', favoriteData[0].id)
        }

        const userStore = useUserStore()
        userStore.setUserData(userData)

        this.$router.push('/')
      } catch {
        alert('Login failed, please check your credentials.')
      } finally {
        this.isLoggingIn = false
      }
    },
    goToRegister() {
      this.$router.push('/register')
    },
  },
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
}

input {
  width: 300px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: rgba(246, 246, 246, 0.2);
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;
}

button:hover {
  background-color: #609fed;
  color: #043e3a;
}

.login-button {
  background-color: #1a519f;
  color: white;
  width: 300px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  justify-self: center;
}

.register-section {
  margin-top: 15px;
}

.register-button {
  background-color: #a11253;
  color: white;
  width: 300px;
  justify-self: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.router-link {
  display: block;
  margin-top: 10px;
  color: #2bbfad;
}
</style>
