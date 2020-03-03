<template>
  <div>
    <v-layout>
      <v-flex offset-xs3 xs6>
         <vue-fuse class="search-bar"
        placeholder="Search for items"
        event-name="results"
        :list="items"
        :keys="['title', 'category']">
      </vue-fuse>
      </v-flex>
    </v-layout>
    <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 md6 lg4 v-for="item in results" :key="item.name">
        <v-container fluid>
        <v-card class="ma-5" shaped>
          <v-img
            height="200px"
            contain
            :src="item.imageurl"
          >
          </v-img>
          <v-card-title class="indigo--text align-end"> {{ item.title }} <v-spacer /> € {{ item.price }} </v-card-title>
          <v-card-subtitle class="pb-0"> {{ item.category }} </v-card-subtitle>

          <v-card-text class="text--primary">
            <div> {{ item.description }} </div>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="onItemView(item._id)" color="blue" text> View </v-btn>
          </v-card-actions>
        </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import ItemService from '../services/itemservice'

export default {
  data () {
    return {
      items: [],
      results: []
    }
  },
  created () {
    this.loadItems()
    this.$on('results', results => {
      this.results = results
    })
  },
  methods: {
    loadItems: function () {
      ItemService.fetchItems()
        .then(response => {
          this.items = response.data
          console.log(this.items)
        })
        .catch(error => {
          this.errors.push(error)
          console.log(error)
        })
    },
    onItemView: function (id) {
      this.$router.push(`/view/item/${id}`)
    },
    runSearch () {
      this.$search('', this.items, { keys: ['title', 'category'] }.then(result => {
        this.results = result
      }))
    }
  }
}
</script>

<style scoped>
</style>
