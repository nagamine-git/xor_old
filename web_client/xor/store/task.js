import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()

export const state = () => ({
  tasks: [],
  status: false
})

export const mutations = {
  getTasks(state, userId) {
    if (userId) {
      const userRef = db.collection('users').doc(userId)
      userRef
        .get()
        .then(doc => {
          if (doc.exists) {
            let taskRefs = doc.data().tasks
            if (taskRefs) {
              let tasks = []
              taskRefs.forEach(taskRef => {
                taskRef.onSnapshot(querySnapshot => {
                  if (
                    querySnapshot.metadata.hasPendingWrites &&
                    querySnapshot.id
                  )
                    state.tasks.forEach(task => {
                      if ((task.id = querySnapshot.id)) {
                        let taskData = querySnapshot.data()
                        task = {
                          id: task.id,
                          title: taskData.title,
                          description: taskData.description,
                          isExpand: taskData.isExpand
                        }
                      }
                    })
                })
                taskRef.get().then(task => {
                  let taskData = task.data()
                  tasks.push({
                    id: task.id,
                    title: taskData.title,
                    description: taskData.description,
                    isExpand: taskData.isExpand
                  })
                })
              })
              state.tasks = tasks
            }
          }
        })
        .catch(function(error) {
          console.log('Error getting document:', error)
        })
    } else {
      state.tasks = []
    }
  }
}
export const getters = {
  tasks(state) {
    return state.tasks
  }
}
