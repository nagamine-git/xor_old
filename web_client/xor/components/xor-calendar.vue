<template>
  <v-flex
    px-1
    pb-1
    md4
    xs12>
    <v-subheader>
      Calendar
    </v-subheader>
    <v-card id="calendar">
      <v-card-title>
        <full-calendar
          :config="config"
          :events="events"
          class="fullcalendar"/>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
import draggable from 'vuedraggable'
import moment from 'moment'
import 'fullcalendar/dist/fullcalendar.css'
let nowHour = moment().format('HH')
let scrollTime = (nowHour > 0 ? nowHour - 1 : nowHour) + ':00:00'
export default {
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
          left: 'prev,next today title',
          center: null,
          right: null
        },
        defaultView: 'agendaDay',
        height: 750,
        nowIndicator: true,
        locale: 'ja',
        editable: true,
        droppable: true,
        drop: (event, obj) => {
          this.dropEvent(event, obj)
        },
        slotDuration: '00:15:00',
        slotLabelInterval: '1:00',
        slotLabelFormat: 'H:mm',
        slotMinutes: 15,
        scrollTime: scrollTime
      }
    }
  },
  methods: {
    dropEvent(event, obj) {
      let date = new Date()
      this.events.push({
        title: obj.target.dataset.name,
        xid: obj.target.dataset.xid,
        start: event._d.toUTCString()
      })
    }
  }
}
</script>

<style scoped>
.fullcalendar >>> .fc-left h2 {
  font-size: 16px;
  line-height: 30px;
}
</style>
