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
        v-if="!isSignIn"
        @click="dialog = true">
        Sign In
      </v-btn>
      <v-btn
        v-else
        @click="signOut">
        Sign Out {{ user.displayName }}
      </v-btn>
      <v-btn
        @click="getCalList">
        Get Cal List
      </v-btn>
      <xor-sign-in-modal
        :dialog.sync="dialog"/>
    </v-navigation-drawer>
    <v-content style="overflow-x: scroll;">
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import XorSignInModal from '~/components/xor-sign-in-modal.vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    XorSignInModal
  },
  data() {
    return {
      dialog: false,
      isDark: true,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{ inital: 'M', title: 'Main', to: '/' }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  computed: {
    ...mapGetters({
      isSignIn: 'user/isSignedIn',
      user: 'user/user'
    })
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      let currentUser = user ? user : {}
      this.onAuthStateChanged(currentUser)
      this.onUserStatusChanged(currentUser.uid ? true : false)
    })
    // gapiを読み込み、読み込み完了したらinitGapiで初期化
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://apis.google.com/js/api.js'
    script.onload = () => {
      this.initGapi()
    }
    // gapiへアクセスできるようにheadに追加
    document.getElementsByTagName('head')[0].appendChild(script)
  },
  methods: {
    getCalList() {
      let request = gapi.client.calendar.calendarList.list()
      request.execute(response => {
        console.log(response.items)
      })
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          let auth2 = gapi.auth2.getAuthInstance()
          auth2
            .disconnect()
            .then(() => {
              alert('ログアウトしました')
              this.dialog = false
            })
            .catch(error => {
              alert('エラーが発生しました')
            })
        })
        .catch(error => {
          alert('エラーが発生しました')
        })
    },
    ...mapMutations({
      onAuthStateChanged: 'user/onAuthStateChanged',
      onUserStatusChanged: 'user/onUserStatusChanged'
    }),
    ...mapActions({
      initGapi: 'user/initGapi',
      firebaseLoginByGoogleToken: 'user/firebaseLoginByGoogleToken'
    })
  }
}
</script>
