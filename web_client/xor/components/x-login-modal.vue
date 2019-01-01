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
            :counter="10"
            label="Password"
            type="password"
            required
          />
          <v-btn @click="createEmailAccount">Create Account</v-btn>
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
          alert(`Create account: ${user.user.email}`)
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
