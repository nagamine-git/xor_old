import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()

export const state = () => ({
  user: {},
  status: false
})

export const mutations = {
  onAuthStateChanged(state, user) {
    state.user = user //firebaseが返したユーザー情報
    if (user.uid) {
      // もしusersコレクションの中にユーザーがいないのであれば、新規ドキュメント追加
      const userRef = db.collection('users').doc(user.uid)
      userRef
        .get()
        .then(doc => {
          if (!doc.exists) {
            userRef.set({ tasks: [] })
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  onUserStatusChanged(state, status) {
    state.status = status //ログインしてるかどうか true or false
  }
}
export const getters = {
  user(state) {
    return state.user
  },
  isSignedIn(state) {
    return state.status
  }
}
