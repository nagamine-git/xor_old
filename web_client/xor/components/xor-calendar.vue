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
          ref="calendar"
          :config="config"
          :events="events"
          class="fullcalendar"
          @event-selected="eventSelected"
          @event-drop="eventDrop"
          @event-resize="eventResize"
          @event-created="eventCreated"/>
      </v-card-title>
    </v-card>
  </v-flex>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import draggable from 'vuedraggable'
const moment = require('moment-timezone')
import 'fullcalendar/dist/fullcalendar.css'
let nowHour = moment().format('HH')
let scrollTime = (nowHour > 0 ? nowHour - 1 : nowHour) + ':00:00'
export default {
  components: {
    draggable
  },
  data() {
    return {
      config: {
        header: {
          left: 'prev,next today title',
          center: null,
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
        },
        slotDuration: '00:15:00',
        slotLabelInterval: '1:00',
        slotLabelFormat: 'H:mm',
        slotMinutes: 15,
        scrollTime: scrollTime
      }
    }
  },
  computed: {
    ...mapState({
      events: state => state.calendar.gcalEvents
    }),
    ...mapGetters({
      isGapiSignedIn: 'user/isGapiSignedIn'
    })
  },
  watch: {
    isGapiSignedIn() {
      this.getGcalEvents()
    }
  },
  methods: {
    dropEvent(event, obj) {
      let date = new Date()
      let startTime = moment(event._d.getTime()).toISOString()
      let endTime = moment(event._d.getTime())
        .add('hours', 1)
        .toISOString()
      this.events.push({
        title: obj.target.dataset.title,
        xor_id: obj.target.dataset.xor_id,
        start: startTime,
        end: endTime
      })
      let resource = {
        summary: obj.target.dataset.title,
        start: {
          dateTime: moment(startTime).add('hours', -9)
        },
        end: {
          dateTime: moment(endTime).add('hours', -9)
        },
        description: obj.target.dataset.xor_id
      }
      let request = gapi.client.calendar.events.insert({
        calendarId: 'nagamine@slogan.jp',
        resource: resource
      })
      request.execute(response => {
        this.getGcalEvents()
      })
    },
    ...mapMutations({
      getGcalEvents: 'calendar/getGcalEvents'
    }),
    eventSelected(obj) {
      console.log('クリックした')
      console.log(obj)
    },
    eventDrop(obj) {
      let resource = {
        start: {
          dateTime: moment(obj.start.toISOString())
            .tz('Asia/Tokyo')
            .toISOString()
        },
        end: {
          dateTime: moment(obj.end.toISOString())
            .tz('Asia/Tokyo')
            .toISOString()
        }
      }
      let request = gapi.client.calendar.events.patch({
        calendarId: 'primary',
        eventId: obj.id,
        resource: resource
      })
      request.execute(response => {
        this.getGcalEvents()
      })
    },
    eventResize(obj) {
      let resource = {
        start: {
          dateTime: moment(obj.start.toISOString())
            .tz('Asia/Tokyo')
            .toISOString()
        },
        end: {
          dateTime: moment(obj.end.toISOString())
            .tz('Asia/Tokyo')
            .toISOString()
        }
      }
      let request = gapi.client.calendar.events.patch({
        calendarId: 'primary',
        eventId: obj.id,
        resource: resource
      })
      request.execute(response => {
        this.getGcalEvents()
      })
    },
    eventCreated(obj) {
      let resource = {
        summary: '新規イベント',
        start: {
          dateTime: moment(obj.start.toISOString())
            .tz('Asia/Tokyo')
            .toISOString()
        },
        end: {
          dateTime: moment(obj.end.toISOString())
            .tz('Asia/Tokyo')
            .toISOString()
        },
        description: 'あたらしいイベント'
      }
      let request = gapi.client.calendar.events.insert({
        calendarId: 'nagamine@slogan.jp',
        resource: resource
      })
      request.execute(response => {
        this.getGcalEvents()
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
