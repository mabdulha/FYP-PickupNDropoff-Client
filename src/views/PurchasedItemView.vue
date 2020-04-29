<template>
<v-container grid-list-xs>
  <v-layout row wrap>
      <v-flex xs12 lg8>
        <v-card elevation-2>
          <v-carousel>
            <v-carousel-item
              v-for="(image, i) in item.imageurl"
              :key="i"
              :src="image"
              contain
            ></v-carousel-item>
          </v-carousel>
          <v-card-title>
            <h4 class="primary--text"> {{ item.title }} </h4>
            <v-spacer></v-spacer>
            <div class="info--text">
              {{ item.price | currency('€') }}
            </div>
          </v-card-title>
          <v-card-text>
            {{ item.description }}
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex class="pl-1" xs12 lg4>
        <v-card elevation-2>
          <v-card-title subtitle>
            Seller
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
            <v-list-item-avatar size="72">
              <img :src="user.avatar" alt="avatar">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text--primary" v-html="fullname" />
              <v-list-item-subtitle v-html="location" />
              <v-list-item-title class="text--primary" v-html="this.user.phone" />
            </v-list-item-content>
            </v-layout>
            <div v-if="item.status === 'Purchased'">
              <iframe :src="map(this.user.aEircode)" frameborder="0" width="100%" height="400px" allowfullscreen></iframe>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import ItemService from '../services/itemservice'
import UserService from '../services/userservice'

const dotenv = require('dotenv')
dotenv.config()

var API_KEY = process.env.VUE_APP_GOOGLE_API_KEY

export default {
  data () {
    return {
      item: {},
      user: {},
      lat: 0,
      lng: 0
    }
  },
  created () {
    this.loadItem()
  },
  methods: {
    loadItem: function (id) {
      id = this.$route.params.id
      ItemService.fetchItem(id)
        .then(response => {
          console.log(id)
          this.item = response.data
          console.log(this.item)
          this.loadUser(this.item.userID)
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadUser: function (id) {
      UserService.fetchUser(id)
        .then(response => {
          this.user = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    map (eircode) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.lat = position.coords.latitude
          this.lng = position.coords.longitude
        },
        error => {
          console.log('Could not get position ' + error)
        }, {
          enableHighAccuracy: true
        }
      )
      let url = `https://www.google.com/maps/embed/v1/directions?origin=${this.lat + ',' + this.lng}&destination=${eircode}&key=${API_KEY}`
      return url
    }
  },
  computed: {
    fullname: function () {
      return this.user.fname + ' ' + this.user.lname
    },
    location: function () {
      return this.user.aTown + ' - Co.' + this.user.aCounty
    }
  }
}
</script>

<style scoped>

</style>
