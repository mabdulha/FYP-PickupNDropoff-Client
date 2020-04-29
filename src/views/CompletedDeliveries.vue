<template>
  <div id="app1">
    <v-client-table :data="items" :columns="columns" :options="options">
      <div slot-scope="props" slot="child_row">
        <iframe :src="map(props.row.pEircode, props.row.dEircode)" frameborder="0" width="100%" height="500px" allowfullscreen></iframe>
      </div>
    </v-client-table>
  </div>
</template>

<script>
import DriverService from '../services/driverservice'
import Vue from 'vue'
import VueTables from 'vue-tables-2'

const dotenv = require('dotenv')
dotenv.config()

var API_KEY = process.env.VUE_APP_GOOGLE_API_KEY

Vue.use(VueTables.ClientTable, { compileTemplates: true, filterByColumn: true })
export default {
  data () {
    return {
      items: [],
      lat: 0,
      lng: 0,
      driverID: this.$store.state.driver._id,
      props: ['_id'],
      columns: ['title', 'size', 'sellerName', 'sellerNumber', 'buyerName', 'buyerNumber', 'ddatetime', 'estCharge'],
      options: {
        perPage: 10,
        uniqueKey: '_id',
        dateColumns: ['datetime'],
        headings: {
          title: 'Item',
          size: 'Size',
          sellerName: 'Seller Name',
          sellerNumber: 'Seller Number',
          buyerName: 'Buyer Name',
          buyerNumber: 'Buyer Number',
          ddatetime: 'Delivery Date and Time',
          estCharge: 'Recommended Charge (€)'
        }
      }
    }
  },
  mounted () {
    this.getItems(this.driverID)
  },
  methods: {
    getItems (id) {
      DriverService.fetchDriverCompletedJobs(id)
        .then(response => {
          this.items = response.data
          console.log(this.items)
        })
        .catch(err => {
          console.log(err)
        })
    },
    map (dEircode, pEircode) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.lat = position.coords.latitude
          this.lng = position.coords.longitude
        },
        error => {
          console.log('Could not get position ' + error)
        }, { enableHighAccuracy: true })

      let url = ''

      if (this.lat === 0 && this.lng === 0) {
        url = `https://www.google.com/maps/embed/v1/directions?origin=${dEircode}&destination=${pEircode}&key=${API_KEY}`
      } else {
        url = `https://www.google.com/maps/embed/v1/directions?origin=${this.lat + ',' + this.lng}&waypoints=${dEircode}&destination=${pEircode}&key=${API_KEY}`
      }
      return url
    }
  }
}
</script>

<style scoped>

#app1 {
  width: 95%;
  margin: 0 auto;
}

</style>
