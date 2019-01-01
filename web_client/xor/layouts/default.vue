<template>
  <v-app :dark="isDark">
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      class="text-xs-right"
      fixed
      app
    >
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" />
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
        >
          <v-list-tile-action v-show="miniVariant">
            <v-icon v-html="item.inital" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-btn
        v-if="!user"
        @click="dialog = true">
        Sign In
      </v-btn>
      <v-btn
        v-else
        @click="signOut">
        Sign Out {{ user.displayName }}
      </v-btn>
      <x-login-modal
        :dialog="dialog"
        @chengeDialog="applyDialog"/>
    </v-navigation-drawer>
    <v-content style="overflow-x: scroll;">
      <v-container style="display: inline;">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import XLoginModal from '~/components/x-login-modal.vue'
export default {
  components: {
    XLoginModal
  },
  data() {
    return {
      user: null,
      dialog: false,
      isDark: true,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        { inital: 'A', title: 'Welcome', to: '/' },
        { inital: 'B', title: 'Inspire', to: '/inspire' }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user
    })
  },
  methods: {
    applyDialog(dialog) {
      this.dialog = dialog
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          alert('Success')
          this.user = null
          this.dialog = false
        })
    }
  }
}
</script>
