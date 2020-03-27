<template>
  <div>
    <v-card-text>
      <v-form ref="RegisterUserForm">
        <v-btn class="primary" @click="onFilePick">Upload Avatar</v-btn>
        <span class="pl-2">(optional)</span>
        <input
          type="file"
          @change="onUploadAvatar"
          style="display:none"
          accept="image/*"
          ref="fileinput"
        />
        <v-layout row>
          <v-flex xs12 sm6 offset-xs1>
            <img :src="avatar" height="200" />
          </v-flex>
        </v-layout>
        <v-text-field
          outlined
          label="First Name"
          v-model="fname"
          :rules="[inputcheck('first name')]"
        />
        <v-text-field
          outlined
          label="Last Name"
          v-model="lname"
          :rules="[inputcheck('last name')]"
        />
        <v-text-field
          outlined
          label="Username"
          v-model="username"
          :rules="[inputcheck('username'), minlen('username', 3)]"
        />
        <v-text-field
          outlined
          label="Email"
          v-model="email"
          :rules="[inputcheck('email'), emailcheck('email')]"
        />
        <v-text-field
          outlined
          label="Password"
          v-model="password"
          :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => (value = !value)"
          :type="value ? 'password' : 'text'"
          :rules="[inputcheck('password'), minlen('password', 6)]"
        />
        <v-text-field
          outlined
          label="Confirm Password"
          v-model="cpassword"
          :append-icon="valuex ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="() => (valuex = !valuex)"
          :type="valuex ? 'password' : 'text'"
          :rules="[inputcheck('password')]"
        />
        <v-text-field
          outlined
          label="Phone"
          type="text"
          v-model="phone"
          counter="10"
          :rules="[inputcheck('phone number'), phonecheck('phone number')]"
        />
        <v-text-field
          outlined
          label="Address"
          type="text"
          v-model="address"
          :rules="[inputcheck('address'), minlen('address', 5)]"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn dark color="indigo" @click="submit">Register</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import AuthService from '../../../services/authservice'
import { fb } from '../../../firebase'

export default {
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.trim().length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v =>
          v.trim().length >= minlen ||
          `${propertyType} must be atleast ${minlen} characters long`
      },
      emailcheck (propertyType) {
        return v => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(v) || `${propertyType} must be valid`
      },
      phonecheck (propertyType) {
        // eslint-disable-next-line no-useless-escape
        return v => /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(v) || `${propertyType} must be in 0123456789 format`
      },
      avatar: '',
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
    onFilePick () {
      this.$refs.fileinput.click()
    },
    onUploadAvatar (e) {
      let image = e.target.files[0]
      let d = new Date()
      var storageRef = fb
        .storage()
        .ref('avatars/' + d.getTime() + '-' + image.name)
      let uploadTask = storageRef.put(image)

      uploadTask.on(
        'state_changed',
        snapshot => {
          // eslint-disable-next-line handle-callback-err
        },
        error => {
          // Handle unsuccessful uploads
          console.log(error)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('File available at', downloadURL)
            this.avatar = downloadURL.toString()
          })
        }
      )
    },
    submit () {
      if (this.$refs.RegisterUserForm.validate()) {
        if (this.password === this.cpassword) {
          if (this.avatar === '') {
            this.avatar =
              'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/avatars%2Fdefault-profile.png?alt=media&token=c0d9df92-b5f6-4526-bfc2-2a27d91519e0'
          }
          var user = {
            avatar: this.avatar,
            fname: this.fname,
            lname: this.lname,
            username: this.username,
            email: this.email,
            password: this.password,
            phone: this.phone,
            address: this.address
          }
          this.user = user
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
      AuthService.registerUser(user)
        .then(response => {
          const credentials = {
            username: user.username,
            password: user.password
          }
          this.credentials = credentials
          this.login(this.credentials)
        })
        .catch(error => {
          this.error = error.response.data.error
          console.log(error)
        })
    },
    login: function (credentials) {
      AuthService.loginUser(credentials)
        .then(response => {
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
</style>
