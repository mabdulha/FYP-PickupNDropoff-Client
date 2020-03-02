<template>
  <v-dialog v-model="dialog" max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="primary">Add New Item</v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Add New Item
        </v-card-title>
        <v-card-text>
          <v-form ref="AddItemForm">
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
                    <img :src="imageurl" height="200">
                  </v-flex>
                </v-layout>
            <v-text-field
              outlined
              label="Title"
              v-model="title"
              :rules="[inputcheck('Title'), minlen('Title', 3)]"
            />
            <v-text-field
              outlined
              label="Description"
              v-model="description"
              :rules="[inputcheck('Description'), minlen('Description', 3)]"
            />
            <v-text-field
              outlined
              label="Category"
              v-model="category"
              :rules="[inputcheck('Category'), minlen('Category', 3)]"
            />
            <v-text-field
              outlined
              label="Size"
              v-model="size"
              :rules="[inputcheck('Size')]"
            />
            <v-text-field
              outlined
              label="Price"
              v-model="price"
              :rules="[inputcheck('Price')]"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
              <v-spacer />
              <v-btn dark color="indigo"
                          @click="submit"
                          >
                          Add Item
                          </v-btn>
            </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ItemService from '../services/itemservice'
import { fb } from '../firebase'

export default {
  data () {
    return {
      inputcheck (propertyType) {
        return v => v.trim().length > 0 || `You must provide a ${propertyType}`
      },
      minlen (propertyType, minlen) {
        return v => v.trim().length >= minlen || `${propertyType} must be atleast ${minlen} characters long`
      },
      dialog: false,
      title: '',
      description: '',
      imageurl: '',
      category: '',
      size: '',
      price: '',
      userID: ''
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
      if (this.$refs.AddItemForm.validate()) {
        if (this.imageurl === '') {
          this.imageurl = 'https://firebasestorage.googleapis.com/v0/b/pickupndropoff-fab91.appspot.com/o/itemImages%2Fno-image-available.jpg?alt=media&token=83425029-2cb6-4e6f-a325-9f83c2d7d17f'
        }
        var item = {
          title: this.title,
          description: this.description,
          imageurl: this.imageurl,
          category: this.category,
          size: this.size,
          price: this.price,
          userID: this.$store.state.user._id
        }
        this.item = item
        this.submitItem(this.item)
        this.dialog = false
      }
    },
    submitItem: (item) => {
      ItemService.addItem(item)
        .then(response => {
          console.log(response)
          console.log(item)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
