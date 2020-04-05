<template>
  <div>
    <v-card-text>
      <v-form ref="RegisterDriverForm">
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
          label="Size"
          type="text"
          v-model="size"
          :rules="[inputcheck('size'), minlen('size', 3)]"
        />
        <v-text-field
          outlined
          label="Street Line 1"
          type="text"
          v-model="aLine1"
          :rules="[inputcheck('street line 1')]"
        />
        <v-text-field
          outlined
          label="Street Line 2"
          type="text"
          v-model="aLine2"
          :rules="[inputcheck('street line 2')]"
        />
        <v-text-field
          outlined
          label="County"
          type="text"
          v-model="aCounty"
          :rules="[inputcheck('county')]"
        />
        <v-text-field
          outlined
          label="Town"
          type="text"
          v-model="aTown"
          :rules="[inputcheck('town')]"
        />
        <v-text-field
          outlined
          label="Eircode"
          type="text"
          v-model="aEircode"
          :rules="[inputcheck('eircode')]"
        />
      </v-form>
      <v-btn class="primary" @click="onFilePick">Upload License</v-btn>
        <span class="pl-2">(mandatory)</span>
        <input
          type="file"
          @change="onUploadLicense"
          capture="environment"
          style="display:none"
          accept="image/*"
          ref="fileinput"
        />
        <v-layout row>
          <v-flex xs12 sm6 offset-xs1>
            <img class="pa-2" :src="license" height="200" />
          </v-flex>
        </v-layout>
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
      fname: '',
      lname: '',
      email: '',
      password: '',
      cpassword: '',
      phone: '',
      license: '',
      size: '',
      aLine1: '',
      aLine2: '',
      aTown: '',
      aCounty: '',
      aEircode: '',
      value: true,
      valuex: true,
      error: null,
      driver: {}
    }
  },
  methods: {
    onFilePick () {
      this.$refs.fileinput.click()
    },
    onUploadLicense (e) {
      let image = e.target.files[0]
      let d = new Date()
      var storageRef = fb
        .storage()
        .ref('licenses/' + d.getTime() + '-' + image.name)
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
            this.license = downloadURL.toString()
          })
        }
      )
    },
    submit () {
      if (this.$refs.RegisterDriverForm.validate()) {
        if (this.password === this.cpassword) {
          var driver = {
            fname: this.fname,
            lname: this.lname,
            email: this.email,
            password: this.password,
            phone: this.phone,
            license: this.license,
            size: this.size,
            aLine1: this.aLine1,
            aLine2: this.aLine2,
            aTown: this.aTown,
            aCounty: this.aCounty,
            aEircode: this.aEircode
          }
          this.driver = driver
          this.submitDriver(driver)
        } else {
          this.$swal.fire({
            title: 'Please Ensure the passwords both match',
            type: 'warning'
          })
        }
      }
    },
    submitDriver: function (driver) {
      AuthService.registerDriver(driver)
        .then(response => {
          const credentials = {
            email: this.email,
            password: this.password
          }
          this.credentials = credentials
          this.login(credentials)
        }).catch(err => {
          console.log(err)
          this.$swal.fire({
            title: `${err.response.data.message}`,
            type: 'error'
          })
        })
    },
    login: function (credentials) {
      AuthService.loginDriver(credentials)
        .then(response => {
          this.$store.dispatch('setDriverToken', response.data.token)
          this.$store.dispatch('setDriver', response.data.driver)
          this.$router.push('/')
        }).catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
