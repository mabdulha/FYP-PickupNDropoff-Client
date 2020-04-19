<template>
  <div id="app1">
    <v-client-table :data="items" :columns="columns" :options="options">
      <a slot="accept" slot-scope="props" class="fa fa-check-circle fa-2x" @click="submit(props.row._id)"></a>
      <div slot="child_row" slot-scope="props">
        <div> Pickup Address: {{ props.row.pLine1 + ', ' + props.row.pLine2 + ', ' + props.row.pTown + ', ' + props.row.pCounty + ', ' + props.row.pEircode }} </div>
        <div> Dropoff Address: {{ props.row.dLine1 + ', ' + props.row.dLine2 + ', ' + props.row.dTown + ', ' + props.row.dCounty + ', ' + props.row.dEircode }} </div>
      </div>
    </v-client-table>
  </div>
</template>

<script>
import DriverService from '../services/driverservice'
import ItemService from '../services/itemservice'
import Vue from 'vue'
import VueTables from 'vue-tables-2'

Vue.use(VueTables.ClientTable, { compileTemplates: true, filterByColumn: false })
export default {
  data () {
    return {
      driver: {},
      driverID: this.$store.state.driver._id,
      items: [],
      item: {},
      props: ['_id'],
      options: {
        perPage: 10,
        headings: {
          title: 'Item',
          size: 'Size',
          pEircode: 'Pickup Address',
          dEircode: 'Dropoff Address',
          datetime: 'Date and Time',
          accept: 'Accept'
        },
        uniqueKey: '_id'
      },
      columns: ['title', 'size', 'datetime', 'charge', 'accept']
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
    submit (id) {
      var item = {
        status: 'In Transit',
        driverID: this.driverID
      }
      this.item = item
      this.updateItem(id, item)
      console.log(item)
    },
    updateItem: function (id, item) {
      console.log(id)
      ItemService.updateItem(id, item)
        .then(response => {
          console.log(response)
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
