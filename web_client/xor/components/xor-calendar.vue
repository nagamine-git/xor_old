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
      this.events.push({
        title: obj.target.dataset.title,
        xor_id: obj.target.dataset.xor_id,
        start: event._d.toUTCString()
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
      console.log('移動された')
      console.log(obj)
    },
    eventResize(obj) {
      console.log('サイズを変えた')
      console.log(obj)
    },
    eventCreated(obj) {
      console.log('イベントが作成された')
      console.log(obj)
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
