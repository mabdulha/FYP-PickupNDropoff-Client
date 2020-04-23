<template>
  <div id="app1">
    <v-client-table :data="items" :columns="columns" :options="options">
      <div slot-scope="props" slot="child_row">
        <iframe :src="submit(props.row.pEircode, props.row.dEircode)" frameborder="0" width="100%" height="500px" allowfullscreen></iframe>
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
      driverID: this.$store.state.driver._id,
      props: ['_id'],
      columns: ['size', 'estCharge', 'datetime'],
      options: {
        perPage: 10,
        uniqueKey: '_id',
        dateColumns: ['datetime']
      }
    }
  },
  mounted () {
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
    submit (dEircode, pEircode) {
      console.log(dEircode, pEircode)
      let url = `https://www.google.com/maps/embed/v1/directions?origin=${pEircode}&destination=${dEircode}&key=${API_KEY}`
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
