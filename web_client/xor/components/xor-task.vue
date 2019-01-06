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
              <v-textarea
                v-show="task.isExpand"
                :value="task.description"
                class="description"
                label="Description"
                single-line/>
            </v-slide-y-transition>
          
          </v-card-title>

          <v-card-actions>
            <v-icon
              v-fcevent
              :data-xid="task.xid" 
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
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
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
      tasks: [
        {
          id: 1,
          title: 'task1',
          xid: 'xid1',
          description: 'hogefuga',
          isExpand: false
        },
        {
          id: 2,
          title: 'task2',
          xid: 'xid2',
          description: 'hogefuga',
          isExpand: false
        },
        {
          id: 3,
          title: 'task3',
          xid: 'xid3',
          description: 'hogefuga',
          isExpand: false
        }
      ]
    }
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
