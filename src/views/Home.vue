<template>
  <h1 class="home">
    {{ fname }}
  </h1>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  components: {
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
