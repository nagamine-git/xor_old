<template>
  <v-flex
    px-1
    pb-1
    md4
    xs12>
    <v-card id="task">
      <v-card-title>
        <div>
          <h3 class="headline mb-0">Task</h3>
          <draggable
            v-for="list in tasks"
            :options="{ group: 'tasks' }"
            :key="list.id"
            element="ul">
            <li
              v-for="item in list"
              :key="item.id">
              {{ item }}
              <span v-fcevent>calendar</span>
            </li>
          </draggable>
        </div>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'XTask',
  components: {
    draggable
  },
  directives: {
    fcevent: {
      bind: function(el) {
        $(el).data('event', {
          title: $.trim($(this).text()), // use the element's text as the event title
          stick: true // maintain when user navigates (see docs on the renderEvent method)
        })

        // Make the event draggable using jQuery UI
        $(el).draggable({
          start: function(event, ui) {
            jQuery.event.dispatch.apply($(document)[0], [event])
          },
          zIndex: 999,
          revert: true, // will cause the event to go back to its
          revertDuration: 0 // original position after the drag
        })
      }
    }
  },
  data() {
    return {
      tasks: [
        ['task1-1', 'task1-2', 'task1-3', 'task1-4'],
        ['task2-1', 'task2-2', 'task2-3', 'task2-4'],
        ['task3-1', 'task3-2', 'task3-3', 'task3-4']
      ]
    }
  }
}
</script>
