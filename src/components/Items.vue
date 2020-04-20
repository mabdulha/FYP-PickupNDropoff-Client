<template>
  <div>
    <v-layout>
      <v-flex offset-xs2 xs8>
        <vue-fuse class="search-bar" placeholder="Search for items" event-name="results" :list="items"
          :keys="['title', 'category']">
        </vue-fuse>
      </v-flex>
    </v-layout>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm8 md6 lg4 v-for="item in filteredResults" :key="item._id">
          <v-container fluid>
            <v-card class="ma-5" shaped>
              <v-img height="210px" contain :src="item.imageurl[0]">
                <v-card-subtitle class="text-end"> <v-icon class="pr-1">mdi-eye</v-icon> {{ item.views }} </v-card-subtitle>
              </v-img>
              <v-card-title class="indigo--text align-end"> {{ item.title }}
                <v-spacer /> {{ item.price | currency('€') }} </v-card-title>
              <v-card-subtitle class="pb-0"> {{ item.category }} </v-card-subtitle>

              <v-card-text class="text--primary">
                <div class="text-truncate"> {{ item.description }} </div>
              </v-card-text>

              <v-card-actions>
                <v-btn @click="onItemView(item._id, item.userID)" color="blue" text> View </v-btn>
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
import _ from 'lodash'

export default {
  data () {
    return {
      items: [],
      results: []
    }
  },
  mounted () {
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
    onItemView: function (id, userID) {
      this.$router.push(`/view/item/${id}`)
      if (this.$store.state.user._id !== userID) {
        ItemService.upviewItem(id)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    runSearch () {
      this.$search('', this.items, { keys: ['title', 'category'] }.then(result => {
        this.results = result
      }))
    }
  },
  computed: {
    filteredResults: function () {
      return _.orderBy(this.results, ['views'], ['desc'])
    }
  }
}
</script>

<style scoped>
.search-bar {
  width: 100%;
  padding: 1em;
  border: solid indigo 1px;
  border-radius: 25em;
}
input:focus, textarea:focus, select:focus{
        outline: none
    }

@media only screen and (max-width: 600px) {
  .search-bar {
    width: 100%;
  }
}
</style>
