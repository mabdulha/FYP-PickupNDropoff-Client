<template>
  <v-layout>
    <v-flex offset-xs3 xs6>
      <v-text-field
        class="pa-0 ma-2"
        outlined
        rounded
        clearable
        label="Search for an item here..."
        v-model="search"
      >
      </v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  },
  watch: {
    search (value) {
      const route = {
        name: 'home'
      }
      if (this.search !== '') {
        route.query = {
          search: this.search
        }
      }
      this.$router.push(route)
    },
    '$route.query.search': {
      immediate: true,
      handler (value) {
        this.search = value
      }
    }
  }
}
</script>

<style>
</style>
