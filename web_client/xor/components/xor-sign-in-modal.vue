<template>
  <v-dialog
    v-model="dialogData"
    width="500">
    <v-flex>
      <v-card>
        <v-form>
          <v-text-field
            v-model="email"
            label="Email"
            required
          />
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          />
          <v-layout v-if="type === 'signIn'">
            <v-btn @click="signInEmailAccount">Sign in</v-btn>
            <v-btn
              outline
              @click="type = 'signUp'">
              Sign up
            </v-btn>
          </v-layout>
          <v-layout v-if="type === 'signUp'">
            <v-btn @click="signUpEmailAccount">Sign up</v-btn>
            <v-btn
              outline
              @click="type = 'signIn'">
              Sign in
            </v-btn>
          </v-layout>
          <v-btn @click="authGoogleAccount">Sign in with Google</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import firebase from '~/plugins/firebase.js'
import { mapMutations } from 'vuex'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'signIn',
      email: '',
      password: '',
      dialogData: this.dialog
    }
  },
  watch: {
    dialogData() {
      this.$emit('chengeDialog', this.dialogData)
    },
    dialog() {
      this.dialogData = this.dialog
    }
  },
  methods: {
    signUpEmailAccount() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          firebase
            .auth()
            .currentUser.sendEmailVerification()
            .then(() => {
              alert(
                `${user.user.email}へ登録メールを送りましたのでご確認ください`
              )
            })
            .catch(err => {
              alert('EmailVerificationでerrが発生しました。', err)
            })
          this.dialogData = false
        })
        .catch(error => {
          alert(error.message)
        })
    },
    signInEmailAccount() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$store.commit('user/setUserId', user.uid)
          alert('ログインしました')
          this.dialogData = false
        })
        .catch(error => {
          alert(error.message)
        })
    },
    authGoogleAccount() {
      const provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/calendar')
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(response => {
          this.$store.commit('user/setUserId', response.user.uid)
          alert(`Create account: ${response.user.email}`)
          axios
            .get(
              'https://www.googleapis.com/calendar/v3/users/me/calendarList',
              {
                headers: {
                  Authorization: 'Bearer ' + response.credential.accessToken
                }
              }
            )
            .then(response => {
              alert(`${response.data.items.length}個のカレンダーがあります`)
            })
            .catch(error => {
              console.error(error)
            })
          this.dialogData = false
        })
    },
    ...mapMutations(['user'])
  }
}
</script>
