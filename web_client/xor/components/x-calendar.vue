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
          <full-calendar
            :config="config"
            :events="events"/>
        </div>
      </v-card-title>
      {{ events }}
    </v-card>
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
import 'fullcalendar/dist/fullcalendar.css'
export default {
  name: 'XCalendar',
  components: {
    draggable
  },
  data() {
    return {
      events: [
        {
          xid: 'xid1',
          title: 'event1',
          start: '2019-01-04T12:30:00'
        },
        {
          xid: 'xid2',
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
        droppable: true,
        drop: (event, obj) => {
          this.dropEvent(event, obj)
        }
      }
    }
  },
  methods: {
    dropEvent(event, obj) {
      let date = new Date()
      this.events.push({
        name: obj.target.dataset.name,
        xid: obj.target.dataset.xid,
        start: event._d.toUTCString()
      })
    }
  }
}
</script>
