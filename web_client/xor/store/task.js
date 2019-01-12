import firebase from '~/plugins/firebase.js'
const uuidv4 = require('uuid/v4')
const db = firebase.firestore()

export const state = () => ({
  tasks: [],
  status: false
})

export const mutations = {
  // タスク一覧を取得し、変更を検知できるようにする
  getTasks(state, userId) {
    if (userId) {
      const userRef = db.collection('users').doc(userId)
      userRef
        .get()
        .then(doc => {
          if (doc.exists) {
            let taskRefs = doc.data().tasks
            if (taskRefs) {
              let tasks = [] // stateを直接編集せず、一時的な配列として作成
              taskRefs.forEach(taskRef => {
                // タスクごとにgetして、taskに入れていく
                taskRef.get().then(task => {
                  let taskData = task.data()
                  if (taskData) {
                    taskData['id'] = task.id
                    tasks.push(taskData)
                  }
                })
                // onSnapshotを実行し、タスクの変更を検知したらstateに反映する
                taskRef.onSnapshot(querySnapshot => {
                  if (
                    querySnapshot.metadata.hasPendingWrites &&
                    querySnapshot.id
                  )
                    // state内のtaskを探し、一致したものののみ反映する
                    state.tasks.forEach(task => {
                      if (task.id == querySnapshot.id) {
                        let taskData = querySnapshot.data()
                        task = taskData
                        task['id'] = task.id
                      }
                    })
                })
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
  // 作成に作成したタスクをfirestoreに反映させる
  setTask(state) {
    const taskId = uuidv4()
    const taskRef = db.collection('tasks').doc(taskId)
    const newTask = {
      title: '',
      description: '',
      isComplete: false,
      isExpand: false
    }
    taskRef.set(newTask)
    newTask['id'] = taskId
    state.tasks.push(newTask)
  },
  // タスク単体の変更をfirestoreに反映させる
  updateTask(state, task) {
    const taskRef = db.collection('tasks').doc(task.id)
    taskRef.update(task)
  },
  // タスクの並び順など、tasks全体での変更があった場合に反映させる
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
