<template>
  <v-container fluid>
    <div>
      <v-radio-group v-model="option" column :mandatory="true">
        <v-radio selected default label="Pickup" color="indigo" value="pickup"></v-radio>
        <v-radio label="Delivery" color="indigo" value="delivery"></v-radio>
      </v-radio-group>
    </div>
    <div v-if="option == 'delivery'">
      <v-form ref="DeliveryAddressForm">
        <div>
          <v-datetime-picker
            label="Select Dropoff Date and Time"
            v-model="datetime"
            :text-field-props="textFieldProps"
            date-format="dd/MM/yyyy"
          ></v-datetime-picker>
        </div>
        <h2 class="pb-3">Delivery Address</h2>
        <v-text-field
          outlined
          label="Street Line 1"
          type="text"
          v-model="dLine1"
          :rules="[inputcheck('street line 1')]"
        />
        <v-text-field outlined label="Street Line 2" type="text" v-model="dLine2" />
        <v-select
          outlined
          :items="counties"
          v-model="dCounty"
          label="County"
          @change="getTowns(dCounty)"
          :rules="[inputcheck('County')]"
        />
        <v-select
          outlined
          :items="towns"
          v-model="dTown"
          label="Town"
          item-text="town"
          :rules="[inputcheck('Town')]"
        />
        <v-text-field
          outlined
          label="Eircode"
          type="text"
          v-model="dEircode"
          :rules="[inputcheck('eircode')]"
        />
        <v-btn color="primary" @click="getLatlng">Calculate Estimated Charge</v-btn>
        <v-layout column>
          <v-simple-table class="pt-5" v-if="distanceloaded == true" height="200px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="subtitle-1 text-left">Distance</th>
                <th class="subtitle-1 text-center">Item Size</th>
                <th class="subtitle-1 text-center">Estimated Delivery Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-left">
                  {{ distance.text }}
                </td>
                <td class="text-center">
                  {{ item.size }}
                </td>
                <td class="text-center">
                  {{ calcDistAmount | currency('€') }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        </v-layout>
      </v-form>
    </div>
    <v-container fluid>
      <div class="pt-2" ref="paypal" />
    </v-container>
  </v-container>
</template>

<script>
import ItemService from '../services/itemservice'
import DeliverService from '../services/deliveryservice'
import TownService from '../services/townservice'
import axios from 'axios'
import moment from 'moment'

const dotenv = require('dotenv')
dotenv.config()

var API_KEY = process.env.VUE_APP_GOOGLE_API_KEY

export default {
  props: ['user', 'userName', 'item', 'itemid'],
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.trim().length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v =>
          v.trim().length >= minlen ||
          `${propertyType} must be atleast ${minlen} characters long`
      },
      loaded: false,
      item2: {},
      distanceloaded: false,
      option: null,
      option2: null,
      datetime: null,
      status: '',
      dLine1: this.$store.state.user.aLine1,
      dLine2: this.$store.state.user.aLine2,
      dTown: this.$store.state.user.aTown,
      dCounty: this.$store.state.user.aCounty,
      dEircode: this.$store.state.user.aEircode,
      buyerID: this.$store.state.user._id,
      fname: this.$store.state.user.fname,
      lname: this.$store.state.user.lname,
      dGeometry: [],
      dlat: null,
      dlng: null,
      counties: [],
      towns: [],
      textFieldProps: {
        outlined: true,
        prependInnerIcon: 'calendar_today',
        solo: true
      },
      distance: {}
    }
  },
  created () {
    this.getCounties()
    this.getTowns(this.dCounty)
  },
  mounted () {
    this.paypalScript()
  },
  methods: {
    paypalScript () {
      const script = document.createElement('script')
      script.src = process.env.VUE_APP_PAYPAL_API
      script.addEventListener('load', this.setLoaded)
      document.body.appendChild(script)
    },
    getCounties: function () {
      TownService.fetchCounties().then(response => {
        this.counties = response.data[0].counties
      })
    },
    getTowns: function (county) {
      TownService.fetchTowns(county).then(response => {
        this.towns = response.data
      })
    },
    getLatlng () {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${this.dEircode}&components=country:IE`
        )
        .then(response => {
          this.dlat = response.data.results[0].geometry.location.lat
          this.dlng = response.data.results[0].geometry.location.lng
          console.log(this.dlat)
          console.log(this.dlng)
          this.getDistance()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDistance () {
      const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${this.origin}&destinations=${this.destination}&key=${API_KEY}`
      axios.get(url)
        .then(response => {
          this.distance = response.data.rows[0].elements[0].distance
          console.log(this.distance)
          this.distanceloaded = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    setLoaded () {
      this.loaded = true
      var ref = this
      window.paypal
        .Buttons({
          style: {
            label: 'checkout',
            shape: 'pill'
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  name: this.item.title,
                  description: this.item.description,
                  amount: {
                    currency_code: 'EUR',
                    value: this.item.price
                  }
                }
              ]
            })
          },
          onApprove: function () {
            ref.submit()
          }
        })
        .render(this.$refs.paypal)
    },
    submit () {
      if (this.option === 'delivery') {
        if (this.$refs.DeliveryAddressForm.validate()) {
          var deliveryJob = {
            size: this.item.size,
            pLine1: this.item.pLine1,
            pLine2: this.item.pLine2,
            pCounty: this.item.pCounty,
            pTown: this.item.pTown,
            pEircode: this.item.pEircode,
            dLine1: this.dLine1,
            dLine2: this.dLine2,
            dTown: this.dTown,
            dCounty: this.dCounty,
            dEircode: this.dEircode,
            buyerName: this.$store.state.user.fname + ' ' + this.$store.state.user.lname,
            buyerNumber: this.$store.state.user.phone,
            sellerName: this.userName,
            sellerNumber: this.user.phone,
            ddatetime: this.datetimeFormat,
            estCharge: this.calcDistAmount
          }
          this.deliveryJob = deliveryJob
          console.log('submit ' + this.deliveryJob)
          this.addDelivery(this.deliveryJob)
        }
      } else {
        var item = {
          status: 'Purchased',
          buyerID: this.buyerID
        }
        this.item2 = item
        this.updateItem(this.itemid, this.item2)
      }
    },
    addDelivery (delivery) {
      console.log('addDelivery ' + delivery)
      DeliverService.addDelivery(delivery)
        .then(response => {
          this.delivery = response
          console.log(response)
          var item = {
            status: 'To Deliver',
            buyerID: this.buyerID
          }
          this.item2 = item
          this.updateItem(this.itemid, this.item2)
        }).catch(err => {
          console.log(err)
        })
    },
    updateItem: (itemid, item) => {
      ItemService.updateItem(itemid, item)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  watch: {
    dCounty: function (newVal, oldVal) {
      this.dCounty = newVal
      console.log(this.dCounty)
    }
  },
  computed: {
    buyername: function () {
      return this.fname + ' ' + this.lname
    },
    origin: function () {
      return this.item.pLine1 + ',' + this.item.pLine2 + ',' + this.item.pCounty
    },
    destination: function () {
      return this.dLine1 + ',' + this.dLine2 + ',' + this.dCounty
    },
    calcDistAmount: function () {
      var total = 0
      var amount = (this.distance.value / 1000) * 0.85
      if (this.item.size === 'Large (Fit into a van)') {
        total = amount + 15
      } else if (this.item.size === 'Medium (Fit into a car)') {
        total = amount + 10
      } else {
        total = amount + 5
      }
      return Math.ceil(total)
    },
    datetimeFormat: function () {
      return moment(this.datetime).format('DD-MM-YYYY HH:mm')
    }
  }
}
</script>
