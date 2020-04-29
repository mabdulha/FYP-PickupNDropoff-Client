<template>
  <div id="app1">
    <v-client-table :data="items" :columns="columns" :options="options">
      <a slot="accept" slot-scope="props" class="fa fa-check-circle fa-2x" @click="submit(props.row._id, props.row.itemID)"></a>
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
import moment from 'moment'
window.moment = moment

Vue.use(VueTables.ClientTable, { compileTemplates: true, filterByColumn: false })

var API_KEY = process.env.VUE_APP_GOOGLE_API_KEY

export default {
  data () {
    return {
      driver: {},
      driverID: this.$store.state.driver._id,
      items: [],
      item: {},
      lat: 0,
      lng: 0,
      props: ['_id'],
      options: {
        perPage: 10,
        headings: {
          title: 'Item',
          size: 'Size',
          ddatetime: 'Date and Time',
          estCharge: 'Recommended Charge',
          accept: 'Accept'
        },
        uniqueKey: '_id'
      },
      columns: ['title', 'size', 'ddatetime', 'estCharge', 'accept']
    }
  },
  mounted () {
    this.getDrivers(this.driverID)
    this.getItems(this.$store.state.driver.preferredTowns)
  },
  updated () {
    this.getItems(this.driver.preferredTowns)
  },
  methods: {
    getDrivers (id) {
      DriverService.fetchDriver(id)
        .then(response => {
          this.driver = response.data
          console.log(this.driver)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getItems (town) {
      console.log(town)
      DriverService.fetchItemsForDeliver(town)
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
        status: 'Accepted',
        driverID: this.$store.state.driver._id
      }
      this.delivery = delivery
      console.log(this.delivery)
      this.updateDelivery(id, this.delivery, itemID)
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
    },
    updateDelivery: function (id, delivery, itemID) {
      DeliveryService.updateDelivery(id, delivery)
        .then(response => {
          console.log(response)
          var item = {
            status: 'In Transit'
          }
          this.item = item
          this.updateItem(itemID, this.item)
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
    }
  },
  computed: {
    fullname: function () {
      return this.driver.fname + ' ' + this.driver.lname
    }
  }
}
</script>

<style scoped>
#app1 {
  width: 95%;
  margin: 0 auto;
}

.VueTables__child-row-toggler {
  width:16px;
  height:16px;
  line-height: 16px;
  display: block;
  margin: auto;
  text-align: center;
}

.VueTables__child-row-toggler--closed::before {
   content: "+";
}

.VueTables__child-row-toggler--open::before  {
    content: "-";
}

</style>
