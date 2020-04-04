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
          <v-text-field
            label="Street Name"
            v-model="stName"
            :rules="NameRules"
            required
          ></v-text-field>
          <v-text-field
            label="E-mail"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-select
            label="Item"
            v-model="select"
            :items="items"
            :rules="[v => !!v || 'Item is required']"
            required
          ></v-select>
          <v-checkbox
            label="Do you agree?"
            v-model="checkbox"
            :rules="[v => !!v || 'You must agree to continue!']"
            required
          ></v-checkbox>

          <v-btn
            @click="submit"
            :disabled="!valid"
          >
            submit
          </v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
      <v-row>
      <v-col cols="6">
        <v-datetime-picker label="Select Dropoff Date and Time" v-model="datetime"></v-datetime-picker>
      </v-col>
      <v-col cols="6">
        <v-datetime-picker label="Select Datetime2" v-model="datetime2"></v-datetime-picker>
      </v-col>
    </v-row>
    </div>
    <div ref="paypal" />
  </v-container>
</template>

<script>
const dotenv = require('dotenv')
dotenv.config()
export default {
  props: ['item'],
  data () {
    return {
      loaded: false,
      option: null,
      datetime: null,
      datetime2: null
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
    }
  }
}
</script>
