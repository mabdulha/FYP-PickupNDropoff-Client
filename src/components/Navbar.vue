/* eslint-disable vue/valid-v-if */
<template>
  <nav>
    <v-navigation-drawer v-model="drawer" app color="indigo lighten-1" dark>
      <v-list dense>
        <v-list-item @click.stop="drawer = !drawer" v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>

        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <router-link to="/" tag="header">
        <v-toolbar-title dark>
          <span class="font-weight-light">PickupN</span>
          <span class="font-weight-bold">Dropoff</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!$store.state.isUserLoggedin">
        <v-btn text v-for="button in buttons" :key="button.text" router :to="button.route">
        <span>
          {{ button.text }}
        </span>
        <v-icon right>
          {{ button.icon }}
        </v-icon>
      </v-btn>
      </v-toolbar-items>
      <div v-if="$store.state.isUserLoggedin">
        <PopupAdd />
      <v-btn text dark @click="logout">
        logout
      </v-btn>
      </div>
    </v-app-bar>
  </nav>
</template>

<script>
import PopupAdd from './PopupAdd'

export default {
  components: {
    PopupAdd
  },
  data: () => ({
    drawer: false,
    buttons: [
      { icon: 'mdi-login', text: 'Login', route: '/login/user' },
      { icon: 'mdi-account-box', text: 'Register', route: '/register/user' }
    ]
  }),
  methods: {
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      if (this.$router.currentRoute.path !== '/') {
        this.$router.push('/')
      } else {
        window.location.reload()
      }
    }
  },
  computed: {
    links () {
      let links = [
        { icon: 'mdi-home', text: 'Home', route: '/' }
      ]
      if (this.$store.state.isUserLoggedin) {
        links = [
          { icon: 'mdi-home', text: 'Home', route: '/' },
          { icon: 'mdi-bookmark', text: 'My Items', route: '/view/items/my' }
        ]
      }
      return links
    }
  }
}
</script>

<style scoped>
  .v-toolbar__title {
    cursor: pointer;
  }

  .v-toolbar__title:hover {
    color: #9FA8DA;
  }
</style>
