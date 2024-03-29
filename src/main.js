import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import VueFuse from 'vue-fuse'
import Vue2Filters from 'vue2-filters'
import DatetimePicker from 'vuetify-datetime-picker'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(DatetimePicker)
Vue.use(Vue2Filters)
Vue.use(VueFuse)
Vue.use(VueSweetalert2)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  Vue2Filters,
  render: h => h(App)
}).$mount('#app')
