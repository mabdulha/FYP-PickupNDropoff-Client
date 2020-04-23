<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field
          outlined
          label="Email"
          prepend-icon="mdi-email"
          v-model="email"
          />
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
      <v-btn dark @click="submit" color="indigo">Login</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import Authservice from '../../../services/authservice'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    submit () {
      var credentials = {
        email: this.email,
        password: this.password
      }
      this.credentials = credentials
      this.login(credentials)
    },
    login: function (credentials) {
      Authservice.loginDriver(credentials)
        .then(response => {
          console.log(response)
          this.$store.dispatch('setDriverToken', response.data.token)
          this.$store.dispatch('setDriver', response.data.driver)
          this.$router.push('/')
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
