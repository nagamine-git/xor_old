import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()

export const state = () => ({
  user: {},
  status: false,
  gapiToken: null
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
  },
  onGapiStatusChanged(state, token) {
    state.gapiToken = token //Gapiでログインしてるかどうか true or false
  }
}
export const getters = {
  user(state) {
    return state.user
  },
  isSignedIn(state) {
    return state.status
  },
  isGapiSignedIn(state) {
    return state.gapiToken ? true : false
  }
}
export const actions = {
  initGapi(state) {
    gapi.load('client:auth2', () => {
      // gapiの初期化
      gapi.client
        .init({
          apiKey: 'AIzaSyDlyaIzRrIYjoReuLvkDSx9kaawv_HwMfE',
          clientId:
            '540604142988-i8c0g09fuks34s12mhgd0uef3gojvrh2.apps.googleusercontent.com',
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
          ],
          scope: ['https://www.googleapis.com/auth/calendar'].join(' ')
        })
        // 初期化が終わったらclientをロード
        .then(() => {
          gapi.client.load('calendar', 'v3', () => {
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
              // gapiでサインインしていれば、firebaseでログイン
              let user = gapi.auth2.getAuthInstance().currentUser.get()
              let token = user.getAuthResponse().id_token
              state.dispatch('onGapiStatusChanged', token)
              state.dispatch('firebaseLoginByGoogleToken', token)
            }
          })
        })
    })
  },
  firebaseLoginByGoogleToken(state, token) {
    return new Promise((resolve, reject) => {
      let creds = firebase.auth.GoogleAuthProvider.credential(token)
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(creds)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
