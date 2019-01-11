<template>
  <v-flex
    px-1
    pb-1
    md4
    xs12>
    <v-subheader>
      Task
    </v-subheader>

    <draggable v-model="tasks">
      <v-flex
        v-for="(task, index) in tasks"
        :key="index"
        mb-2>
        <v-card class="task__card">
          <v-card-title>
            <v-text-field
              v-model="task.title"
              class="title"
              label="Title"
              single-line
              @keyup="changeTask(task)"/>

            <v-slide-y-transition>
              <v-layout v-show="task.isExpand">
                <div
                  v-show="!(editingIndex == index)"
                  @click="editDescription(index)"
                  v-html="$md.render(computedDescription(task.description))"/>
                <v-textarea
                  v-show="editingIndex == index"
                  :ref="'edit_' + index"
                  v-model="task.description"
                  class="description"
                  label="Description"
                  single-line
                  @keyup="changeTask(task)"
                  @keyup.ctrl.enter="editingIndex = null"
                  @keyup.meta.enter="editingIndex = null"
                  @blur="editingIndex = null"/>
              </v-layout>
            </v-slide-y-transition>
          
          </v-card-title>

          <v-card-actions>
            <v-icon
              v-fcevent
              :data-id="task.uid" 
              :data-name="task.name"
              class="icon_calendar">event</v-icon>
            <v-btn 
              flat 
              icon><v-icon>done</v-icon></v-btn>
            <v-btn 
              flat 
              icon><v-icon>delete</v-icon></v-btn>
            <v-spacer/>
            <v-btn 
              icon 
              @click="task.isExpand = !task.isExpand">
              <v-icon>{{ task.isExpand ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </draggable>
    <v-card
      class="task__card text-md-center"
      @click="addTask()">
      <v-flex py-1><v-icon>add</v-icon></v-flex>
    </v-card>
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
import firebase from '~/plugins/firebase.js'
import { mapGetters, mapMutations } from 'vuex'
const db = firebase.firestore()
export default {
  components: {
    draggable
  },
  directives: {
    fcevent: {
      bind(el) {
        $(el).data('event', {
          title: el.dataset.name,
          stick: true
        })
        $(el).draggable({
          revert: true,
          revertDuration: 0
        })
      }
    }
  },
  data() {
    return {
      show: true,
      editingIndex: null,
      tasks: []
    }
  },
  computed: {
    ...mapGetters({
      isSignIn: 'user/isSignedIn',
      user: 'user/user',
      stateTasks: 'task/tasks'
    })
  },
  watch: {
    stateTasks() {
      this.tasks = this.stateTasks
    },
    user() {
      this.getTasks(this.isSignIn ? this.user.uid : false)
    }
  },
  methods: {
    editDescription(index) {
      this.editingIndex = index
      this.$nextTick(function() {
        this.$refs['edit_' + index][0].focus()
      })
    },
    addTask() {
      this.setTask(this.user.uid)
    },
    ...mapMutations({
      getTasks: 'task/getTasks',
      setTask: 'task/setTask',
      updateTask: 'task/updateTask'
    }),
    changeTask(task) {
      if (task) {
        this.updateTask(task)
      }
    },
    computedDescription(description) {
      return description ? description : 'ここをクリックしてください'
    }
  }
}
</script>

<style scoped>
.title {
  margin: 0px auto;
  padding: 0px;
  width: 100%;
}
.task__card >>> .v-card__title {
  padding-bottom: 0px;
}
.title >>> .v-input__slot {
  margin: 0px auto;
  padding: 0px;
}
.title >>> .v-input__slot::before {
  border: none;
}
.title >>> .v-input__slot::after {
  border: none;
}
.description {
  margin: 0px auto;
  padding: 0px;
}
.description >>> .v-input__slot::before {
  border: none;
}
.description >>> .v-input__slot::after {
  border: none;
}
.icon_calendar {
  padding: 6px;
}
</style>
