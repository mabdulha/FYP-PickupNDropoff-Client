<template>
  <div ref="paypal" />
</template>

<script>
const dotenv = require('dotenv')
dotenv.config()
export default {
  props: ['item'],
  data () {
    return {
      loaded: false
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
                  description: this.item.title,
                  amount: {
                    currency_code: 'EUR',
                    value: this.item.price
                  }
                }
              ]
            })
          }
        }).render(this.$refs.paypal)
    }
  }
}
</script>
