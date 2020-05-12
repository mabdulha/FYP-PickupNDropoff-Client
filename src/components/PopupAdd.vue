<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary">Add Item</v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Add New Item
        </v-card-title>
        <v-card-text>
          <v-form ref="AddItemForm">
            <v-btn class="primary" @click="onFilePick">
                  Upload Image
                </v-btn>
                <input type="file"
                        @change="onUploadImage"
                        style="display:none"
                        accept="image/*"
                        multiple
                        ref="fileinput"
                        />
                <v-layout row>
                  <v-flex xs12 sm9 offset-xs1>
                    <img class="pt-3 edit-image" v-for="(image, i) in imageurl" :key="i" :src="imageurl[i]">
                  </v-flex>
                </v-layout>
            <v-text-field
            class="pt-3"
              outlined
              label="Title"
              v-model="title"
              :rules="[inputcheck('Title'), minlen('Title', 3)]"
            />
            <v-textarea
              outlined
              label="Description"
              rows="3"
              counter
              v-model="description"
              :rules="[inputcheck('Description'), minlen('Description', 3)]"
            />
            <div>
            <v-datetime-picker
              label="Select Pickup Date and Time"
              v-model="datetime"
              :text-field-props="textFieldProps"
              date-format="dd/MM/yyyy"
              :rules="[inputcheck('Date and Time')]"
            ></v-datetime-picker>
          </div>
            <v-select
              outlined
              :items="categories"
              v-model="category"
              label="Category"
              :rules="[inputcheck('Category')]"
            ></v-select>
            <v-select
              outlined
              :items="sizes"
              v-model="size"
              label="Size"
              :rules="[inputcheck('Size')]"
            ></v-select>
            <v-text-field
              outlined
              label="Price"
              v-model="price"
              prefix="€"
              type="number"
              :rules="[inputcheck('Price')]"
            />
            <v-container fluid>
              <p>
                Is the Pickup Address the same as your Address?
              </p>
              <v-radio-group v-model="option" column :mandatory="true">
                <v-radio selected default label="Yes" color="indigo" value="yes"></v-radio>
                <v-radio label="No" color="indigo" value="no"></v-radio>
              </v-radio-group>
            </v-container>
            <div v-if="option == 'no'">
              <v-text-field
              outlined
              label="Street Line 1"
              type="text"
              v-model="pLine1"
              :rules="[inputcheck('street line 1')]"
            />
            <v-text-field
              outlined
              label="Street Line 2"
              type="text"
              v-model="pLine2"
            />
            <v-select
              outlined
              :items="counties"
              v-model="pCounty"
              label="County"
              @change="getTowns(pCounty)"
              :rules="[inputcheck('County')]"
            />
            <v-select
              outlined
              :items="towns"
              v-model="pTown"
              label="Town"
              item-text="town"
              :rules="[inputcheck('Town')]"
            />
            <v-text-field
              outlined
              label="Eircode"
              type="text"
              v-model="pEircode"
              :rules="[inputcheck('eircode')]"
            />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
              <v-spacer />
              <v-btn dark color="indigo"
                          @click="getLatlng"
                          >
                          Add Item
                          </v-btn>
            </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ItemService from '../services/itemservice'
import TownService from '../services/townservice'
import moment from 'moment'
import { fb } from '../firebase'
import axios from 'axios'

const dotenv = require('dotenv')
dotenv.config()

export default {
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.trim().length > 0 || `You must provide a ${propertyType}`
      },

      minlen (propertyType, minlen) {
        return v => v.trim().length >= minlen || `${propertyType} must be atleast ${minlen} characters long`
      },

      dialog: false,
      option: null,
      status: 'Available',
      title: '',
      description: '',
      imageurl: [],
      category: '',
      size: '',
      price: '',
      userID: this.$store.state.user._id,
      pLine1: '',
      pLine2: '',
      pTown: '',
      pCounty: '',
      pEircode: '',
      pGeometry: [],
      counties: [],
      towns: [],
      categories: ['Clothing', 'Electonics', 'Furniture', 'Health', 'Music', 'Parts', 'Outdoor', 'Other'],
      sizes: ['Small (Fit on a motorbike)', 'Medium (Fit into a car)', 'Large (Fit into a van)'],
      plat: null,
      plng: null,
      datetime: null,
      textFieldProps: {
        outlined: true,
        prependInnerIcon: 'calendar_today',
        solo: true
      }
    }
  },
  created () {
    this.getCounties()
  },
  methods: {
    onFilePick () {
      this.$refs.fileinput.click()
    },
    onUploadImage (e) {
      for (var i = 0; i < e.target.files.length; i++) {
        let image = e.target.files[i]

        this.postImages(image)
      }
    },
    postImages: function (images) {
      var thisRef = this
      return new Promise(function (resolve, reject) {
        let d = new Date()
        var storageRef = fb.storage().ref('itemImages/' + d.getTime() + '-' + images.name)
        let uploadTask = storageRef.put(images)

        uploadTask.on('state_changed', (snapshot) => {
          // eslint-disable-next-line handle-callback-err
        }, (error) => {
        // Handle unsuccessful uploads
          console.log(error)
        }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL)
            thisRef.imageurl.push(downloadURL.toString())
          })
        })
      })
    },
    getCounties: function () {
      TownService.fetchCounties()
        .then(response => {
          this.counties = response.data[0].counties
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
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${this.pEircode}&components=country:IE`)
        .then(response => {
          this.plat = response.data.results[0].geometry.location.lat
          this.plng = response.data.results[0].geometry.location.lng
          console.log(this.plat)
          console.log(this.plng)
          this.submit()
        })
        .catch(err => {
          console.log(err)
        })
    },
    submit () {
      if (this.$refs.AddItemForm.validate()) {
        if (this.imageurl.length === 0) {
          this.imageurl.push('https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/itemImages%2Fimage-unavailable.png?alt=media&token=13cdd462-18d3-45d7-9948-6dd0278d04f9')
        }
        if (this.option === 'yes') {
          var item = {
            status: this.status,
            title: this.title,
            description: this.description,
            imageurl: this.imageurl,
            category: this.category,
            size: this.size,
            price: this.price,
            userID: this.userID,
            pLine1: this.$store.state.user.aLine1,
            pLine2: this.$store.state.user.aLine2,
            pTown: this.$store.state.user.aTown,
            pCounty: this.$store.state.user.aCounty,
            pEircode: this.$store.state.user.aEircode,
            pGeometry: this.pGeometry,
            plat: this.plat,
            plng: this.plng,
            datetime: this.datetimeFormat
          }
          this.item = item
        } else {
          var item2 = {
            status: this.status,
            title: this.title,
            description: this.description,
            imageurl: this.imageurl,
            category: this.category,
            size: this.size,
            price: this.price,
            userID: this.$store.state.user._id,
            pLine1: this.pLine1,
            pLine2: this.pLine2,
            pTown: this.pTown,
            pCounty: this.pCounty,
            pEircode: this.pEircode,
            pGeometry: this.pGeometry,
            plat: this.plat,
            plng: this.plng,
            datetime: this.datetimeFormat
          }
          this.item = item2
        }
        this.submitItem(this.item)
        this.dialog = false
      }
    },
    submitItem (item) {
      ItemService.addItem(item)
        .then(response => {
          console.log(response)
          console.log(item)
          this.$swal.fire({
            position: 'top-end',
            type: 'success',
            text: 'Item Added Successfully',
            timer: 2000
          })
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    pCounty: function (newVal, oldVal) {
      this.pCounty = newVal
      console.log(this.pCounty)
    }
  },
  computed: {
    datetimeFormat: function () {
      return moment(this.datetime).format('DD-MM-YYYY HH:mm')
    }
  }
}
</script>

<style scoped>

.edit-image {
  display: inline-block;
  width: 33%;
}

</style>
