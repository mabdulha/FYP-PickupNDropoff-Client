<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm8 md6 lg4 v-for="item in items" :key="item._id">
        <v-container fluid>
        <v-card class="ma-5" shaped>
          <v-img height="210px" contain :src="item.imageurl[0]">
          <v-card-subtitle class="text-end"> <v-icon class="pr-1">mdi-eye</v-icon> {{ item.views }} </v-card-subtitle>
          </v-img>
          <v-card-title class="indigo--text align-end"> {{ item.title }} <v-spacer /> {{ item.price | currency('€') }} </v-card-title>
          <v-card-subtitle class="pb-0"> {{ item.category }} </v-card-subtitle>

          <v-card-text class="text--primary">
            <div class="text-truncate"> {{ item.description }} </div>
            <div :class="itemstatus(item.status)" color="primary"> {{ item.status }} </div>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="onItemView(item._id)" color="blue" text> View </v-btn>
            <v-spacer></v-spacer>
               <EditItem :item="item" :itemid="item._id" />
            <v-btn @click="onItemDelete(item._id)" icon color="red">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ItemService from '../services/itemservice'
import EditItem from '../components/EditItem'

export default {
  components: {
    EditItem
  },
  data () {
    return {
      items: [],
      dialog: false,
      userID: this.$store.state.user._id
    }
  },
  created () {
    this.loadItems(this.userID)
  },
  methods: {
    itemstatus (status) {
      var style = ''
      if (status === 'Available') {
        style = 'teal--text pt-2'
      } else if (status === 'Purchased') {
        style = 'blue--text pt-2'
      } else if (status === 'To Deliver') {
        style = 'orange--text pt-2'
      } else if (status === 'In Transit') {
        style = 'indigo--text pt-2'
      } else if (status === 'Delivered') {
        style = 'pink--text pt-2'
      } else {
        style = 'gray--text pt-2'
      }
      return style
    },
    loadItems: function (userID) {
      console.log(userID)
      ItemService.fetchItemsByUser(userID)
        .then(response => {
          this.items = response.data
          console.log(this.items)
        })
        .catch(error => {
          console.log(error)
        })
    },
    onItemView: function (id) {
      this.$router.push(`/view/item/${id}`)
    },
    onItemDelete: function (id) {
      this.$swal.fire({
        title: 'Are you totally sure?',
        text: 'You can\'t Undo this action',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK Delete it',
        cancelButtonText: 'Cancel',
        showCloseButton: true,
        showLoaderOnConfirm: true
      }).then((result) => {
        console.log('SWAL Result : ' + result)
        console.log(id)
        if (result.value) {
          ItemService.deleteItem(id)
            .then(response => {
              this.message = response.data
              console.log(this.message)
              this.loadItems()
              this.$swal('Deleted', 'You have successfully deleted this item', 'success')
              const itemindex = this.items.findIndex(i => i._id === id)
              this.items.splice(itemindex, 1)
            })
            .catch(error => {
              this.$swal('ERROR', 'Something went wrong while deleting, Please try again')
              console.log(error)
            })
        } else {
          this.$swal('Cancelled', 'Cound not delete item!', 'info')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
