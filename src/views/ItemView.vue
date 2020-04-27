<template>
<v-container grid-list-xs>
  <v-layout row wrap>
      <v-flex xs12 lg8>
        <v-card elevation-2>
          <!-- <v-img
          max-height="500px"
          contain
          :src="item.imageurl"
          >
          </v-img> -->
          <v-carousel>
            <v-carousel-item
              v-for="(image, i) in item.imageurl"
              :key="i"
              :src="image"
            ></v-carousel-item>
          </v-carousel>
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
            <v-btn v-if=" this.$store.state.isUserLoggedin" v-show="loadpurchase == false && this.$store.state.user._id != this.item.userID" tile outlined @click="onPurchase" color="primary">
              <v-icon left>mdi-credit-card-outline</v-icon> Purchase
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex class="pl-1" xs12 lg4>
        <v-card elevation-2>
          <v-card-title subtitle>
            Seller
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
            <v-list-item-avatar size="64">
              <img :src="user.avatar" alt="avatar">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="text--primary" v-html="fullname" />
              <v-list-item-subtitle v-html="location" />
            </v-list-item-content>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="loadpurchase == true" row wrap>
      <v-flex>
        <purchaseitem :user="user" :userName="fullname" :item="item" :itemid="this.item._id" />
      </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import ItemService from '../services/itemservice'
import UserService from '../services/userservice'
import purchaseitem from '@/components/PurchaseItem.vue'

export default {
  components: {
    purchaseitem
  },
  data () {
    return {
      item: {},
      user: {},
      loadpurchase: false
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
          this.loadUser(this.item.userID)
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadUser: function (id) {
      UserService.fetchUser(id)
        .then(response => {
          this.user = response.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    onPurchase () {
      this.loadpurchase = true
    }
  },
  computed: {
    fullname: function () {
      return this.user.fname + ' ' + this.user.lname
    },
    location: function () {
      return this.user.aTown + ' - Co.' + this.user.aCounty
    }
  }
}
</script>

<style scoped>

</style>
