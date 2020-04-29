<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field outlined label="Username" prepend-icon="mdi-account" v-model="username" />
        <v-text-field
          outlined
          label="Password"
          prepend-icon="mdi-lock"
          type="password"
          v-model="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn dark @click="submit" class="login-btn" color="indigo">Login</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import Authservice from '../../../services/authservice'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit () {
      var credentials = {
        username: this.username,
        password: this.password
      }
      this.credentials = credentials
      this.login(credentials)
    },
    login: function (credentials) {
      Authservice.loginUser(credentials)
        .then(response => {
          this.$store.dispatch('setUserToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.$router.push('/')
          this.$swal.fire({
            position: 'top-end',
            type: 'success',
            text: 'Welcome Back ' + this.username,
            timer: 2000
          })
        })
        .catch(err => {
          console.log(err)
          this.$swal.fire({
            title: `${err.response.data.message}`,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style scoped>
</style>
