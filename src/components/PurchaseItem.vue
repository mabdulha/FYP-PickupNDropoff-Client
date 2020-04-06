<template>
  <v-container fluid>
    <div>
      <v-radio-group v-model="option" column :mandatory="true">
        <v-radio selected default label="Pickup" color="indigo" value="pickup"></v-radio>
        <v-radio label="Delivery" color="indigo" value="delivery"></v-radio>
      </v-radio-group>
    </div>
    <div v-if="option == 'delivery'">
        <v-form ref="DeliveryAddress" lazy-validation>
          <h2 class="pb-3"> Delivery Address </h2>
          <v-text-field
          outlined
          label="Street Line 1"
          type="text"
          v-model="dLine1"
          :rules="[inputcheck('street line 1')]"
        />
        <v-text-field
          outlined
          label="Street Line 2"
          type="text"
          v-model="dLine2"
          :rules="[inputcheck('street line 2')]"
        />
        <v-text-field
          outlined
          label="County"
          type="text"
          v-model="dCounty"
          :rules="[inputcheck('county')]"
        />
        <v-text-field
          outlined
          label="Town"
          type="text"
          v-model="dTown"
          :rules="[inputcheck('town')]"
        />
        <v-text-field
          outlined
          label="Eircode"
          type="text"
          v-model="dEircode"
          :rules="[inputcheck('eircode')]"
        />
        <v-btn
        color="primary"
        @click="submit"
        >
          Update Address
        </v-btn>
        </v-form>
      <!-- <v-row>
      <v-col cols="6">
        <v-datetime-picker label="Select Dropoff Date and Time" v-model="datetime" date-format="dd/MM/yyyy"></v-datetime-picker>
      </v-col>
      <v-col cols="6">
        <v-datetime-picker label="Select Datetime2" v-model="datetime2"></v-datetime-picker>
      </v-col>
    </v-row> -->
    </div>
    <div ref="paypal" />
  </v-container>
</template>

<script>
import ItemService from '../services/itemservice'

const dotenv = require('dotenv')
dotenv.config()

export default {
  props: ['item', 'itemid'],
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
      option: null,
      option2: null,
      // datetime: null,
      // datetime2: null,
      dLine1: this.$store.state.user.aLine1,
      dLine2: this.$store.state.user.aLine2,
      dTown: this.$store.state.user.aTown,
      dCounty: this.$store.state.user.aCounty,
      dEircode: this.$store.state.user.aEircode
    }
  },
  mounted () {
    const script = document.createElement('script')
    script.src = process.env.VUE_APP_PAYPAL_API
    script.addEventListener('load', this.setLoaded)
    document.body.appendChild(script)
  },
  methods: {
    setLoaded () {
      this.loaded = true
      window.paypal
        .Buttons({
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
          }
        })
        .render(this.$refs.paypal)
    },
    submit () {
      if (this.$refs.DeliveryAddress.validate()) {
        var item = {
          dLine1: this.dLine1,
          dLine2: this.dLine2,
          dTown: this.dTown,
          dCounty: this.dCounty,
          dEircode: this.dEircode
        }
        this.item = item
        this.updateItem(this.itemid, this.item)
        console.log(item)
      }
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
  }
}
</script>
