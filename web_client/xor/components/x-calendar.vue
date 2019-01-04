<template>
  <v-flex
    px-1
    pb-1
    md4
    xs12>
    <v-card id="calendar">
      <v-card-title>
        <div>
          <h3 class="headline mb-0">Calendar</h3>
          <draggable
            v-for="list in tasks"
            :options="{ group: 'tasks' }"
            :key="list.id"
            element="ul">
            <li
              v-fcevent
              v-for="item in list"
              :key="item.id">{{ item }}</li>
          </draggable>
          <full-calendar
            :config="config"
            :events="events"/>
        </div>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
import 'fullcalendar/dist/fullcalendar.css'
export default {
  name: 'XCalendar',
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
  components: {
    draggable
  },
  data() {
    return {
      tasks: [
        ['task1-1', 'task1-2', 'task1-3', 'task1-4'],
        ['task2-1', 'task2-2', 'task2-3', 'task2-4'],
        ['task3-1', 'task3-2', 'task3-3', 'task3-4']
      ],
      events: [
        {
          title: 'event1',
          start: '2019-01-01'
        },
        {
          title: 'event2',
          start: '2010-01-05',
          end: '2019-01-07'
        },
        {
          title: 'event3',
          start: '2019-01-09T12:30:00',
          allDay: false
        }
      ],
      config: {
        header: {
          left: 'prev,next today',
          center: 'title',
          right: null
        },
        defaultView: 'agendaDay',
        height: 650,
        nowIndicator: true,
        locale: 'ja',
        editable: true,
        droppable: true
      }
    }
  }
}
</script>
