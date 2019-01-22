import firebase from '~/plugins/firebase.js'
import axios from 'axios'
import moment from 'moment'

const uuidv4 = require('uuid/v4')
const db = firebase.firestore()

export const state = () => ({
  gcalEvents: []
})

export const mutations = {
  // タスク一覧を取得し、変更を検知できるようにする
  getGcalEvents(state) {
    if (this.getters['user/isGapiSignedIn']) {
      let request = gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: moment()
          .add('days', -4)
          .toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime'
      })
      request.execute(response => {
        if (response.items) {
          let events = []
          response.items.forEach(item => {
            events.push({
              id: item.id,
              title: item.summary,
              start: item.start.dateTime,
              end: item.end.dateTime
            })
          })
          state.gcalEvents = events
        }
      })
    }
  }
}
