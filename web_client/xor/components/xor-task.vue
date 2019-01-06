<template>
  <v-flex
    px-1
    pb-1
    md4
    xs12>
    <v-subheader>
      Task
    </v-subheader>
    <v-card id="task">
      <v-card-title>
        <draggable v-model="tasks">
          <div 
            v-for="task in tasks"
            :key="task.id">
            {{ task.name }}
            <v-icon
              v-fcevent
              :data-xid="task.xid"
              :data-name="task.name">event</v-icon>
          </div>
        </draggable>
      </v-card-title>
    </v-card>
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
      tasks: [
        { id: 1, name: 'task1', xid: 'xid1' },
        { id: 2, name: 'task2', xid: 'xid2' },
        { id: 3, name: 'task3', xid: 'xid3' }
      ]
    }
  }
}
</script>
