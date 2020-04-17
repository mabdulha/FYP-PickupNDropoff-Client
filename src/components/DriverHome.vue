<template>
  <v-container fluid>
    <v-client-table :data="items" :columns="columns" :options="options">
    </v-client-table>
  </v-container>
</template>

<script>
import DriverService from '../services/driverservice'
import Vue from 'vue'
import VueTables from 'vue-tables-2'

Vue.use(VueTables.ClientTable, { compileTemplates: true, filterByColumn: false })
export default {
  data () {
    return {
      driver: {},
      driverID: this.$store.state.driver._id,
      items: [],
      options: {
        perPage: 10,
        headings: {
          title: 'Title',
          size: 'Size',
          pTown: 'pAddress',
          datetime: 'Date and Time'
        }
      },
      columns: ['title', 'size', 'pAddress', 'aAddress', 'datetime', 'charge']
    }
  },
  mounted () {
    this.getDrivers(this.driverID)
    this.getItems(this.$store.state.driver.preferredTowns)
  },
  // updated () {
  //   this.getItems(this.driver.preferredTowns)
  //   console.log(this.driver.preferredTowns)
  // },
  methods: {
    getDrivers (id) {
      DriverService.fetchDriver(id)
        .then(response => {
          this.driver = response.data
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
    }
  },
  computed: {
    fullname: function () {
      return this.driver.fname + ' ' + this.driver.lname
    }
  }
}
</script>
