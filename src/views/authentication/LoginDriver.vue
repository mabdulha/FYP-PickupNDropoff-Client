<template>
  <v-content>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="indigo" dark flat>
              <v-toolbar-title>Driver Login</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field outlined label="Email" prepend-icon="mdi-email" v-model="email" />
                <v-text-field outlined label="Password" prepend-icon="mdi-lock" type="password" v-model="password" />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn dark color="indigo">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
