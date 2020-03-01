<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card elevation-2>
          <v-img
          height="500px"
          :src="item.imageurl"
          >
          </v-img>
          <v-card-title>
            <h4 class="primary--text"> {{ item.title }} </h4>
            <v-spacer></v-spacer>
            <div>
              € {{ item.price }}
            </div>
          </v-card-title>
          <v-card-text>
            {{ item.description }}
          </v-card-text>
          <v-card-actions>
            <v-btn tile outlined color="primary">
              <v-icon left>mdi-credit-card-outline</v-icon> Purchase
            </v-btn>
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
      item: []
    }
  },
  created () {
    this.loadItem()
  },
  methods: {
    loadItem: function (id) {
      id = this.$route.params.id
      ItemService.fetchItem(id)
        .then(response => {
          console.log(id)
          this.item = response.data
          console.log(this.item)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>
