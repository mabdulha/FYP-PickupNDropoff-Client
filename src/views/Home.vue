<template>
  <div class="mt-5">
    <itemsview />
  </div>
</template>

<script>
// @ is an alias to /src
import itemsview from '@/components/Items.vue'

export default {
  name: 'home',
  components: {
    itemsview
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
