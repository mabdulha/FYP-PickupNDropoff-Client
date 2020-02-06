<template>
  <v-content>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="indigo" dark flat>
              <v-toolbar-title>User Register</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form ref="RegisterForm">
                <v-text-field label="First Name"
                              v-model="fname"
                              :rules="[inputcheck('first name')]"
                              />
                <v-text-field label="Last Name"
                              v-model="lname"
                              :rules="[inputcheck('last name')]"
                              />
                <v-text-field label="Username"
                              v-model="username"
                              :rules="[inputcheck('username'), minlen('username', 3)]"
                              />
                <v-text-field label="Email"
                              v-model="email"
                              :rules="[inputcheck('email'), emailcheck('email')]"
                              />
                <v-text-field label="Password"
                              v-model="password"
                              :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="() => (value = !value)"
                              :type="value ? 'password' : 'text'"
                              :rules="[inputcheck('password'), minlen('password', 6)]"
                              />
                <v-text-field label="Confirm Password"
                              v-model="cpassword"
                              :append-icon="valuex ? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="() => (valuex = !valuex)"
                              :type="valuex ? 'password' : 'text'"
                              :rules="[inputcheck('password')]"
                              />
                <v-text-field label="Phone"
                              type="text"
                              v-model="phone"
                              :rules="[inputcheck('phone number'), phonecheck('phone number')]"
                              />
                <v-text-field label="Address"
                              type="text"
                              v-model="address"
                              :rules="[inputcheck('address'), minlen('address', 5)]"
                              />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn dark color="indigo"
                          @click="submit">
                          Register
                          </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import AuthService from '../../services/authservice'

export default {
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.trim().length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v => v.trim().length >= minlen || `${propertyType} must be atleast ${minlen} characters long`
      },
      emailcheck (propertyType) {
        return v => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(v) || `${propertyType} must be valid`
      },
      phonecheck (propertyType) {
        // eslint-disable-next-line no-useless-escape
        return v => /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(v) || `${propertyType} must be in 0123456789 format`
      },
      fname: '',
      lname: '',
      username: '',
      email: '',
      password: '',
      cpassword: '',
      phone: '',
      address: '',
      value: true,
      valuex: true,
      error: null,
      user: {}
    }
  },
  methods: {
    submit () {
      if (this.$refs.RegisterForm.validate()) {
        if (this.password === this.cpassword) {
          var user = {
            fname: this.fname,
            lname: this.lname,
            username: this.username,
            email: this.email,
            password: this.password,
            phone: this.phone,
            address: this.address
          }
          this.user = user
          console.log('Submitting in Register : ' + JSON.stringify(this.user, null, 5))
          this.submitUser(this.user)
        } else {
          this.$swal({
            title: 'Please Ensure the passwords both match',
            icon: 'warning'
          })
        }
      }
    },
    submitUser: function (user) {
      console.log('submitUser')
      AuthService.register(user)
        .then(response => {
          console.log(response)
          console.log(user)
        }).catch(error => {
          this.error = error.response.data.error
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>
