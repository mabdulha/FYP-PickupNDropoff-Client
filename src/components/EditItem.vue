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
                    <img :src="editedImageurl" height="200">
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
              v-model="editedPrice"
              :rules="[inputcheck('Price')]"
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
      editedImageurl: this.item.imageurl
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
          this.imageurl = downloadURL.toString()
        })
      })
    },
    submit () {
      if (this.$refs.EditItemForm.validate()) {
        if (this.imageurl === '') {
          this.imageurl = 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/itemImages%2Fno-image-available.jpg?alt=media&token=83425029-2cb6-4e6f-a325-9f83c2d7d17f'
        }
        var item = {
          title: this.editedTitle,
          description: this.editedDescription,
          imageurl: this.editedImageurl,
          category: this.editedCategory,
          size: this.editedSize,
          price: this.editedPrice,
          userID: this.$store.state.user._id
        }
        this.item = item
        this.updateItem(this.itemid, item)
        console.log(item)
        this.dialog = false
      }
    },
    updateItem: (item) => {
      ItemService.updateItem(item)
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
