<template>
  <div>
    <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon color="primary">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Edit Item
        </v-card-title>
        <v-card-text>
          <v-form ref="EditItemForm">
            <v-btn class="primary" @click="onFilePick">
                  Upload Image
                </v-btn>
                <span>
                  (optional)
                </span>
                <input type="file"
                        @change="onUploadImage"
                        style="display:none"
                        accept="image/*"
                        multiple
                        ref="fileinput"
                        />
                <v-layout row>
                  <v-flex xs12 sm9 offset-xs1>
                    <img class="pa-3 edit-image" v-for="(image, i) in editedImageurl" :key="i" :src="editedImageurl[i]">
                  </v-flex>
                </v-layout>
            <v-text-field
              outlined
              label="Title"
              v-model="editedTitle"
              :rules="[inputcheck('Title'), minlen('Title', 3)]"
            />
            <v-textarea
              outlined
              label="Description"
              rows="3"
              counter
              v-model="editedDescription"
              :rules="[inputcheck('Description'), minlen('Description', 3)]"
            />
            <v-select
              outlined
              :items="editedCategory"
              v-model="category"
              label="Category"
              :rules="[inputcheck('Category')]"
            ></v-select>
            <v-select
              outlined
              :items="editedSize"
              v-model="size"
              label="Size"
              :rules="[inputcheck('Size')]"
            ></v-select>
            <v-text-field
              outlined
              label="Price"
              type="number"
              v-model="editedPrice"
              prefix="€"
            />
            <v-text-field
              outlined
              label="Street Line 1"
              type="text"
              v-model="editedPLine1"
              :rules="[inputcheck('street line 1')]"
            />
            <v-text-field
              outlined
              label="Street Line 2"
              type="text"
              v-model="editedPLine2"
            />
            <v-select
              outlined
              :items="counties"
              v-model="editedPCounty"
              label="County"
              @change="getTowns(editedPCounty)"
              :rules="[inputcheck('County')]"
            />
            <v-select
              outlined
              :items="towns"
              v-model="editedPTown"
              label="Town"
              item-text="town"
              :rules="[inputcheck('Town')]"
            />
            <v-text-field
              outlined
              label="Eircode"
              type="text"
              v-model="editedPEircode"
              :rules="[inputcheck('eircode')]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
              <v-spacer />
              <v-btn dark color="indigo"
                          @click="getLatlng"
                          >
                          Edit Item
                          </v-btn>
            </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import ItemService from '../services/itemservice'
import TownService from '../services/townservice'
import { fb } from '../firebase'
import axios from 'axios'

const dotenv = require('dotenv')
dotenv.config()

export default {
  props: ['item', 'itemid'],
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v => v.length >= minlen || `${propertyType} must be atleast ${minlen} characters long`
      },
      dialog: false,
      childDataLoaded: false,
      editedTitle: this.item.title,
      editedDescription: this.item.description,
      editedPrice: this.item.price,
      category: this.item.category,
      size: this.item.size,
      editedImageurl: this.item.imageurl,
      editedPLine1: this.item.pLine1,
      editedPLine2: this.item.pLine2,
      editedPTown: this.item.pTown,
      editedPCounty: this.item.pCounty,
      editedPEircode: this.item.pEircode,
      editedGeometry: this.item.pGeometry,
      editedLat: this.item.plat,
      editedLng: this.item.plng,
      editedCategory: ['Clothing', 'Electonics', 'Furniture', 'Health', 'Music', 'Parts', 'Outdoor', 'Other'],
      editedSize: ['Small (Fit on a motorbike)', 'Medium (Fit into a car)', 'Large (Fit into a van)'],
      counties: [],
      towns: []
    }
  },
  created () {
    this.getCounties()
    this.getTowns(this.editedPCounty)
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
            thisRef.editedImageurl.push(downloadURL.toString())
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
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${this.editedPEircode}&components=country:IE`)
        .then(response => {
          this.editedLat = response.data.results[0].geometry.location.lat
          this.editedLng = response.data.results[0].geometry.location.lng
          console.log(this.editedLat)
          console.log(this.editedLng)
          this.submit()
        })
        .catch(err => {
          console.log(err)
        })
    },
    submit () {
      if (this.$refs.EditItemForm.validate()) {
        var item = {
          title: this.editedTitle,
          description: this.editedDescription,
          imageurl: this.editedImageurl,
          category: this.category,
          size: this.size,
          price: this.editedPrice,
          userID: this.$store.state.user._id,
          pLine1: this.editedPLine1,
          pLine2: this.editedPLine2,
          pTown: this.editedPTown,
          pCounty: this.editedPCounty,
          pEircode: this.editedPEircode,
          pGeometry: this.editedGeometry,
          plat: this.editedLat,
          plng: this.editedLng
        }
        this.item = item
        this.updateItem(this.itemid, this.item)
        console.log(item)
        this.dialog = false
      }
    },
    updateItem: (itemId, item) => {
      ItemService.updateItem(itemId, item)
        .then(response => {
          console.log(response)
          // window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    editedPCounty: function (newVal, oldVal) {
      this.editedPCounty = newVal
      console.log(this.editedPCounty)
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
