<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card elevation-2>
          <v-img
          max-height="500px"
          contain
          :src="item.imageurl"
          >
          </v-img>
          <v-card-title>
            <h4 class="primary--text"> {{ item.title }} </h4>
            <v-spacer></v-spacer>
            <div class="info--text">
              {{ item.price | currency('€') }}
            </div>
          </v-card-title>
          <v-card-text>
            {{ item.description }}
          </v-card-text>
          <v-card-actions>
            <v-btn v-show="loadpurchase == false && this.$store.state.user._id != this.item.userID" tile outlined @click="onPurchase" color="primary">
              <v-icon left>mdi-credit-card-outline</v-icon> Purchase
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="loadpurchase == true" row wrap>
      <v-flex>
        <purchaseitem :item="item" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ItemService from '../services/itemservice'
import purchaseitem from '@/components/PurchaseItem.vue'

export default {
  components: {
    purchaseitem
  },
  data () {
    return {
      item: [],
      loadpurchase: false
    }
  },
  mounted () {
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
    },
    onPurchase () {
      this.loadpurchase = true
    }
  }
}
</script>

<style scoped>

</style>
