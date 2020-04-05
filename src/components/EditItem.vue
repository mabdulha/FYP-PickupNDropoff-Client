<template>
  <div>
    <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon color="primary">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Edit Item
        </v-card-title>
        <v-card-text>
          <v-form ref="EditItemForm">
            <v-btn class="primary" @click="onFilePick">
                  Upload Image
                </v-btn>
                <span>
                  (optional)
                </span>
                <input type="file"
                        @change="onUploadImage"
                        style="display:none"
                        accept="image/*"
                        ref="fileinput"
                        />
                <v-layout row>
                  <v-flex xs12 sm6 offset-xs1>
                    <img class="pa-3" :src="editedImageurl" height="200">
                  </v-flex>
                </v-layout>
            <v-text-field
              outlined
              label="Title"
              v-model="editedTitle"
              :rules="[inputcheck('Title'), minlen('Title', 3)]"
            />
            <v-text-field
              outlined
              label="Description"
              v-model="editedDescription"
              :rules="[inputcheck('Description'), minlen('Description', 3)]"
            />
            <v-text-field
              outlined
              label="Category"
              v-model="editedCategory"
              :rules="[inputcheck('Category'), minlen('Category', 3)]"
            />
            <v-text-field
              outlined
              label="Size"
              v-model="editedSize"
              :rules="[inputcheck('Size')]"
            />
            <v-text-field
              outlined
              label="Price"
              type="number"
              v-model="editedPrice"
              :rules="[inputcheck('Price')]"
            />
            <v-text-field
              outlined
              label="Street Line 1"
              type="text"
              v-model="editedPLine1"
              :rules="[inputcheck('street line 1')]"
            />
            <v-text-field
              outlined
              label="Street Line 2"
              type="text"
              v-model="editedPLine2"
              :rules="[inputcheck('street line 2')]"
            />
            <v-text-field
              outlined
              label="County"
              type="text"
              v-model="editedPCounty"
              :rules="[inputcheck('county')]"
            />
            <v-text-field
              outlined
              label="Town"
              type="text"
              v-model="editedPTown"
              :rules="[inputcheck('town')]"
            />
            <v-text-field
              outlined
              label="Eircode"
              type="text"
              v-model="editedPEircode"
              :rules="[inputcheck('eircode')]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
              <v-spacer />
              <v-btn dark color="indigo"
                          @click="submit"
                          >
                          Edit Item
                          </v-btn>
            </v-card-actions>
    </v-card>
  </v-dialog>
  </div>
</template>

<script>
import ItemService from '../services/itemservice'
import { fb } from '../firebase'

export default {
  props: ['item', 'itemid'],
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v => v.length >= minlen || `${propertyType} must be atleast ${minlen} characters long`
      },
      dialog: false,
      childDataLoaded: false,
      editedTitle: this.item.title,
      editedDescription: this.item.description,
      editedCategory: this.item.category,
      editedPrice: this.item.price,
      editedSize: this.item.size,
      editedImageurl: this.item.imageurl,
      editedPLine1: this.item.pLine1,
      editedPLine2: this.item.pLine2,
      editedPTown: this.item.pTown,
      editedPCounty: this.item.pCounty,
      editedPEircode: this.item.pEircode
    }
  },
  methods: {
    onFilePick () {
      this.$refs.fileinput.click()
    },
    onUploadImage (e) {
      let image = e.target.files[0]
      let d = new Date()
      var storageRef = fb.storage().ref('itemImages/' + d.getTime() + '-' + image.name)
      let uploadTask = storageRef.put(image)

      uploadTask.on('state_changed', (snapshot) => {
      // eslint-disable-next-line handle-callback-err
      }, (error) => {
        // Handle unsuccessful uploads
        console.log(error)
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
          this.editedImageurl = downloadURL.toString()
        })
      })
    },
    submit () {
      if (this.$refs.EditItemForm.validate()) {
        var item = {
          title: this.editedTitle,
          description: this.editedDescription,
          imageurl: this.editedImageurl,
          category: this.editedCategory,
          size: this.editedSize,
          price: this.editedPrice,
          userID: this.$store.state.user._id,
          pLine1: this.editedPLine1,
          pLine2: this.editedPLine2,
          pTown: this.editedPTown,
          pCounty: this.editedPCounty,
          pEircode: this.editedPEircode

        }
        this.item = item
        this.updateItem(this.itemid, this.item)
        console.log(item)
        this.dialog = false
      }
    },
    updateItem: (itemId, item) => {
      ItemService.updateItem(itemId, item)
        .then(response => {
          console.log(response)
          window.location.reload()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
