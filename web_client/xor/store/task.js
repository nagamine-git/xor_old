import firebase from '~/plugins/firebase.js'
const uuidv4 = require('uuid/v4')
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
                      if (task.id == querySnapshot.id) {
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
                  if (taskData) {
                    tasks.push({
                      id: task.id,
                      title: taskData.title,
                      description: taskData.description,
                      isExpand: taskData.isExpand
                    })
                  }
                })
              })
              tasks.sort((a, b) => {
                if (a.sequence < b.sequence) return -1
                if (a.sequence > b.sequence) return 1
                return 0
              })
              state.tasks = tasks
            }
          }
        })
        .catch(function(error) {
          console.error('Error getting document:', error)
        })
    } else {
      state.tasks = []
    }
  },
  setTask(state, userId) {
    const taskId = uuidv4()
    const taskRef = db.collection('tasks').doc(taskId)
    const userRef = db.collection('users').doc(userId)
    const newTask = {
      title: '',
      description: '',
      isExpand: false
    }
    taskRef.set(newTask)
    newTask['id'] = taskId
    state.tasks.push(newTask)
  },
  updateTask(state, task) {
    const taskRef = db.collection('tasks').doc(task.id)
    taskRef.update(task)
  },
  updateTaskRefs(state, object) {
    if (object.tasks.length > 0) {
      const userRef = db.collection('users').doc(object.userId)
      let taskArray = []
      object.tasks.forEach(task => {
        taskArray.push(db.collection('tasks').doc(task.id))
      })
      userRef.update({
        tasks: taskArray
      })
    }
  }
}
export const getters = {
  tasks(state) {
    return state.tasks
  }
}
