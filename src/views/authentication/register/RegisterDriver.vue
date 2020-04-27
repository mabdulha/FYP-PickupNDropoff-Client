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
        <v-select
          outlined
          :items="sizes"
          v-model="size"
          label="Vehicle Type"
          :rules="[inputcheck('vehicle type')]"
          @change="getCounties"
        ></v-select>
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
        />
        <v-select
          outlined
          :items="counties"
          v-model="aCounty"
          label="County"
          @change="getTowns(aCounty)"
          :rules="[inputcheck('county')]"
        />
        <v-select
          outlined
          :items="towns"
          v-model="aTown"
          label="Town"
          item-text="town"
          :rules="[inputcheck('town')]"
        />
        <v-text-field
          outlined
          label="Eircode"
          type="text"
          v-model="aEircode"
          :rules="[inputcheck('eircode')]"
        />
        <v-select
          outlined
          :items="counties"
          v-model="pCounty"
          label="County"
          @change="getTowns(pCounty)"
          :rules="[inputcheck('county')]"
        />
        <v-select
          outlined
          :items="towns"
          label="Preferred Towns"
          v-model="preferredTowns"
          multiple
          chips
          item-text="town"
          :rules="[inputcheck('preferred towns')]"
        />
      </v-form>
      <v-btn class="primary" @click="onFilePick">Upload License</v-btn>
        <span class="pl-2">(mandatory)</span>
        <input
          type="file"
          @change="onUploadLicense"
          style="display:none"
          accept="image/*"
          ref="fileinput"
          multiple
        />
        <v-layout row>
          <v-flex xs12 sm6 offset-xs1>
            <img class="pt-3 edit-image" v-for="(image, i) in license" :key="i" :src="license[i]">
          </v-flex>
        </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn dark color="indigo" @click="getLatlng">Register</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import AuthService from '../../../services/authservice'
import TownService from '../../../services/townservice'
import { fb } from '../../../firebase'
import axios from 'axios'

const dotenv = require('dotenv')
dotenv.config()

export default {
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v =>
          v.length >= minlen ||
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
      license: [],
      size: '',
      aLine1: '',
      aLine2: '',
      aTown: '',
      aCounty: '',
      pCounty: '',
      aEircode: '',
      preferredTowns: [],
      value: true,
      valuex: true,
      error: null,
      driver: {},
      sizes: ['Car', 'Caravan', 'Motorbike', 'Pickup', 'Van'],
      counties: [],
      towns: [],
      alltowns: [],
      aGeometry: [],
      alat: null,
      alng: null
    }
  },
  created () {
    this.getCounties()
  },
  methods: {
    onFilePick () {
      this.$refs.fileinput.click()
    },
    onUploadLicense (e) {
      for (var i = 0; i < e.target.files.length; i++) {
        let image = e.target.files[i]

        this.postLicense(image)
      }
    },
    postLicense: function (images) {
      var licenseRef = this
      return new Promise(function (resolve, reject) {
        let d = new Date()
        var storageRef = fb
          .storage()
          .ref('licenses/' + d.getTime() + '-' + images.name)
        let uploadTask = storageRef.put(images)

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
              licenseRef.license.push(downloadURL.toString())
            })
          }
        )
      })
    },
    getCounties: function () {
      TownService.fetchCounties()
        .then(response => {
          this.counties = response.data[0].counties
          console.log(this.counties)
        })
    },
    getTowns: function (county) {
      TownService.fetchTowns(county)
        .then(response => {
          this.towns = response.data
        })
    },
    getLatlng () {
      var API_KEY = process.env.VUE_APP_GOOGLE_API_KEY
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${this.aEircode}&components=country:IE`)
        .then(response => {
          this.alat = response.data.results[0].geometry.location.lat
          this.alng = response.data.results[0].geometry.location.lng
          console.log(this.alat)
          console.log(this.alng)
          this.submit()
        })
        .catch(err => {
          console.log(err)
        })
    },
    submit () {
      if (this.$refs.RegisterDriverForm.validate()) {
        if (this.password === this.cpassword) {
          if (this.avatar === '') {
            this.avatar =
              'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/avatars%2Fdefault-icon.png?alt=media&token=ea489f7f-3530-40ce-98ec-d45f10f5d83d'
          }
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
            aEircode: this.aEircode,
            aGeometry: this.aGeometry,
            alat: this.alat,
            alng: this.alng,
            preferredTowns: this.preferredTowns
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
  },
  watch: {
    aCounty: function (newVal, oldVal) {
      this.aCounty = newVal
      console.log(this.aCounty)
    },
    pCounty: function (newVal, oldVal) {
      this.pCounty = newVal
      console.log(this.pCounty)
    }
  }
}
</script>
