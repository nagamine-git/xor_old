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
import { mapActions, mapMutations } from 'vuex'
import axios from 'axios'
import firebase from '~/plugins/firebase.js'
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
      this.$emit('update:dialog', this.dialogData)
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
          alert('ログインしました')
          this.dialogData = false
        })
        .catch(error => {
          alert(error.message)
        })
    },
    authGoogleAccount() {
      // gapiでサインインしていなければ、gapiのポップアップで新規サインイン
      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          let user = gapi.auth2.getAuthInstance().currentUser.get()
          let token = user.getAuthResponse().id_token
          this.onGapiStatusChanged(token)
          this.firebaseLoginByGoogleToken(token)
            .then(res => {
              alert('ログインに成功しました')
              this.dialogData = false
            })
            .catch(error => {
              alert('ログインに失敗しました')
              this.dialogData = false
            })
        })
        .catch(error => {
          console.log(error)
        })
    },
    ...mapMutations({
      onGapiStatusChanged: 'user/onGapiStatusChanged'
    }),
    ...mapActions({
      firebaseLoginByGoogleToken: 'user/firebaseLoginByGoogleToken'
    })
  }
}
</script>
