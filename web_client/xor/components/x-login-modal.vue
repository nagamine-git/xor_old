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
          <v-layout v-if="type === 'login'">
            <v-btn @click="loginEmailAccount">Login</v-btn>
            <v-btn
              outline
              @click="type = 'register'">
              SignUp
            </v-btn>
          </v-layout>
          <v-layout v-if="type === 'register'">
            <v-btn @click="createEmailAccount">Create Account</v-btn>
            <v-btn
              outline
              @click="type = 'login'">
              Login
            </v-btn>
          </v-layout>
          <v-btn @click="authGoogleAccount">Sign in with Google</v-btn>
        </v-form>
      </v-card>
    </v-flex>
  </v-dialog>
</template>

<script>
import firebase from '~/plugins/firebase.js'
export default {
  name: 'XLoginModal',
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: 'login',
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
    createEmailAccount() {
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
    loginEmailAccount() {
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
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(user => {
          alert(`Create account: ${user.user.email}`)
          this.dialogData = false
        })
    }
  }
}
</script>
