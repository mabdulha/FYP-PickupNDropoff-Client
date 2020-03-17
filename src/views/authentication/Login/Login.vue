<template>
  <v-content>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card class="elevation-12">
            <v-toolbar color="indigo" dark flat>
              <v-tabs background-color="indigo" dark>
                <v-tab to="/login/user">User</v-tab>
                <v-tab to="/login/driver">Driver</v-tab>
              </v-tabs>
            </v-toolbar>
            <router-view></router-view>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
