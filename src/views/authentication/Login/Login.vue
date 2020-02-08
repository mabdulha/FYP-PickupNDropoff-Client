<template>
 <v-container>
   <v-tabs>
     <v-tab to="/login/user">
       User
     </v-tab>
     <v-tab to="/login/driver">
       Driver
     </v-tab>
   </v-tabs>
   <router-view></router-view>
 </v-container>
</template>
