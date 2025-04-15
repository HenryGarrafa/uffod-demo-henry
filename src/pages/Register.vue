<template>
  <div class="register-page">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="name" placeholder="Full Name" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button class="signup-button">Register</button>
    </form>
    <p>Already have an account?</p>
    <button class="login-button" @click="goToLogin">Login</button>
  </div>
</template>

<script>
import { createDefaultFavoriteList, register } from '@/services/authService.js'

export default {
  components: {},
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  methods: {
    async handleRegister() {
      try {
        const response = await register(this.name, this.email, this.password)
        alert(`Account created successfully for ${response.name}! You can now log in.`)

        await createDefaultFavoriteList()

        this.$router.push('/login')
      } catch {
        alert('Signup failed. Please try again.')
      }
    },
    goToLogin() {
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

.signup-button {
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
