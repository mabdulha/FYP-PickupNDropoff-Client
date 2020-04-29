<template>
  <div id="app1">
    <v-client-table :data="items" :columns="columns" :options="options">
      <a slot="delivered" slot-scope="props" class="fa fa-check-circle fa-2x" @click="submit(props.row._id, props.row.itemID)"></a>
      <a slot="cancel" slot-scope="props" class="fa fa-times-circle fa-2x" @click="cancel(props.row._id, props.row.itemID)"></a>
      <div slot-scope="props" slot="child_row">
        <iframe :src="map(props.row.pEircode, props.row.dEircode)" frameborder="0" width="100%" height="500px" allowfullscreen></iframe>
      </div>
    </v-client-table>
  </div>
</template>

<script>
import DriverService from '../services/driverservice'
import DeliveryService from '../services/deliveryservice'
import ItemService from '../services/itemservice'
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
      columns: ['title', 'size', 'sellerName', 'sellerNumber', 'buyerName', 'buyerNumber', 'ddatetime', 'estCharge', 'delivered', 'cancel'],
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
          estCharge: 'Recommended Charge (€)',
          delivered: 'Delivered',
          cancel: 'Cancel'
        }
      }
    }
  },
  mounted () {
    this.getItems(this.driverID)
  },
  updated () {
    this.getItems(this.driverID)
  },
  methods: {
    getItems (id) {
      DriverService.fetchDriverJobs(id)
        .then(response => {
          this.items = response.data
          console.log(this.items)
        })
        .catch(err => {
          console.log(err)
        })
    },
    submit (id, itemID) {
      console.log(id)
      var delivery = {
        status: 'Delivered',
        driverID: this.$store.state.driver._id
      }
      this.delivery = delivery
      console.log(this.delivery)
      this.updateDelivery(id, this.delivery, itemID)
    },
    updateDelivery: function (id, delivery, itemID) {
      DeliveryService.updateDelivery(id, delivery)
        .then(response => {
          console.log(response)
          var item = {
            status: 'Delivered'
          }
          this.item = item
          this.updateItem(itemID, this.item)
        }).catch(err => {
          console.log(err)
        })
    },
    cancel (id, itemID) {
      var delivery2 = {
        status: 'Available for Delivery'
      }
      this.delivery2 = delivery2
      console.log(this.delivery2)
      this.cancelDelivery(id, this.delivery2, itemID)
    },
    cancelDelivery: function (id, delivery2, itemID) {
      DeliveryService.updateDelivery(id, delivery2)
        .then(res => {
          console.log(res)
          var item2 = {
            status: 'To Deliver'
          }
          this.item2 = item2
          this.updateItem(itemID, this.item2)
        }).catch(err => {
          console.log(err)
        })
    },
    updateItem: function (id, item) {
      console.log(id)
      console.log(item)
      ItemService.updateItem(id, item)
        .then(response => {
          console.log(response)
        }).catch(err => {
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
