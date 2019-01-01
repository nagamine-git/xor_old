<template>
  <v-layout>
    <x-timer/>
    <x-calendar/>
    <x-task/>
    <x-assistant/>
  </v-layout>
</template>

<script>
import XTimer from '~/components/x-timer.vue'
import XCalendar from '~/components/x-calendar.vue'
import XTask from '~/components/x-task.vue'
import XAssistant from '~/components/x-assistant.vue'
export default {
  components: {
    XTimer,
    XCalendar,
    XTask,
    XAssistant
  }
}
</script>
