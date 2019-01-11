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
        v-for="task in tasks"
        :key="task.id"
        mb-2>
        <v-card class="task__card">
          <v-card-title>
            <v-text-field
              v-model="task.title"
              class="title"
              label="Title"
              single-line/>

            <v-slide-y-transition>
              <v-layout v-show="task.isExpand">
                <div
                  v-show="!(editingId == task.id)"
                  @click="editDescription(task.id)"
                  v-html="$md.render(task.description)"/>
                <v-textarea
                  v-show="editingId == task.id"
                  :ref="'edit_' + task.id"
                  v-model="task.description"
                  class="description"
                  label="Description"
                  single-line
                  @keyup.ctrl.enter="editingId = null"
                  @keyup.meta.enter="editingId = null"
                  @blur="editingId = null"/>
              </v-layout>
            </v-slide-y-transition>
          
          </v-card-title>

          <v-card-actions>
            <v-icon
              v-fcevent
              :data-id="task.id" 
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
      editingId: null,
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
    editDescription(id) {
      this.editingId = id
      this.$nextTick(function() {
        this.$refs['edit_' + id][0].focus()
      })
    },
    addTask() {
      this.setTask(this.user.uid)
    },
    ...mapMutations({
      getTasks: 'task/getTasks',
      setTask: 'task/setTask'
    })
  }
}
</script>

<style scoped>
.title {
  margin: 0px auto;
  padding: 0px;
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
