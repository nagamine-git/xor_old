<template>
  <v-layout :wrap="isMobile">
    <x-timer class="function"/>
    <x-calendar class="function"/>
    <x-task class="function"/>
    <x-assistant class="function"/>
    <x-apps class="function"/>
  </v-layout>
</template>

<script>
import XTimer from '~/components/x-timer.vue'
import XCalendar from '~/components/x-calendar.vue'
import XTask from '~/components/x-task.vue'
import XAssistant from '~/components/x-assistant.vue'
import XApps from '~/components/x-apps.vue'
export default {
  components: {
    XTimer,
    XCalendar,
    XTask,
    XAssistant,
    XApps
  },
  computed: {
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true
        case 'sm':
          return true
        case 'md':
          return false
        case 'lg':
          return false
        case 'xl':
          return false
      }
    }
  }
}
</script>

<style scoped>
.function >>> .v-card {
  width: 300px;
}
.function:first-child >>> .v-card {
  margin-left: 16px;
}
.function:last-child >>> .v-card {
  margin-right: 16px;
}
</style>
