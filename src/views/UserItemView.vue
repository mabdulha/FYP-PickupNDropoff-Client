<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 md6 lg4 v-for="item in items" :key="item.name">
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
</template>

<script>
import ItemService from '../services/itemservice'

export default {
  data () {
    return {
      items: [],
      userID: this.$store.state.user._id
    }
  },
  created () {
    this.loadItems(this.userID)
  },
  methods: {
    loadItems: function (userID) {
      console.log(userID)
      ItemService.fetchItemsByUser(userID)
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
    }
  }
}
</script>

<style scoped>
</style>
