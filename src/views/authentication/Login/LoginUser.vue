<template>
  <v-content>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="indigo" dark flat>
              <v-toolbar-title>User Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field outlined label="Username" prepend-icon="mdi-account" v-model="username" />
                <v-text-field outlined label="Password" prepend-icon="mdi-lock" type="password" v-model="password" />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn dark @click="submit" class='login-btn' color="indigo">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
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
      Authservice.login(credentials)
        .then(response => {
          console.log(response)
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
          this.$swal({
            title: `${err.response.data.message}`,
            icon: 'error'
          })
        })
    }
  }
}
</script>

<style scoped>

</style>
