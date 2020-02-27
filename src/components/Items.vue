<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 md6 lg4 v-for="item in items" :key="item.name">
        <v-card class="ma-5" shaped>
          <v-img
            class="indigo--text align-end"
            height="200px"
            :src="item.imageurl"
          >
            <v-card-title> {{ item.title }} <v-spacer /> € {{ item.price }} </v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0"> {{ item.category }} </v-card-subtitle>

          <v-card-text class="text--primary">
            <div> {{ item.description }} </div>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="onClick(item._id)" color="orange" text> View </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ItemService from '../services/itemservice'

export default {
  data () {
    return {
      items: []
    }
  },
  created () {
    this.loadItems()
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
    onClick: function (id) {
      alert(id)
    }
  }
}
</script>

<style scoped>
</style>
