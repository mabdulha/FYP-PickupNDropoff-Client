<template>
  <div>
    <v-card-text>
      <v-form>
        <v-text-field
          outlined
          label="Email"
          prepend-icon="mdi-email"
          v-model="email"
          />
        <v-text-field
          outlined
          label="Password"
          prepend-icon="mdi-lock"
          type="password"
          v-model="password"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn dark color="indigo">Login</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style scoped>
</style>
