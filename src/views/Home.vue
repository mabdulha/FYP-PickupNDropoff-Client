<template>
  <div>
    <div v-if="!$store.state.isDriverLoggedin" class="mt-5">
      <itemsview />
    </div>
    <div v-if="$store.state.isDriverLoggedin">
      <driverhome />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import itemsview from '@/components/Items.vue'
import driverhome from '@/components/DriverHome'

export default {
  name: 'home',
  components: {
    itemsview,
    driverhome
  },
  data () {
    return {
      fname: ' '
    }
  },
  mounted () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      if (this.$store.state.user != null) {
        this.fname = this.$store.state.user.fname
      }
    }
  }
}
</script>
