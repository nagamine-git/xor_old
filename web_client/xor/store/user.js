export const state = () => ({
  user: {},
  status: false
})

export const mutations = {
  onAuthStateChanged(state, user) {
    state.user = user //firebaseが返したユーザー情報
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
