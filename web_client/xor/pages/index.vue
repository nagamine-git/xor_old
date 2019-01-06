<template>
  <v-layout :wrap="isMobile">
    <xor-timer class="function"/>
    <v-divider
      class="mx-2"
      vertical/>
    <xor-calendar class="function"/>
    <v-divider
      class="mx-2"
      vertical/>
    <xor-task class="function"/>
    <v-divider
      class="mx-2"
      vertical/>
    <xor-assistant class="function"/>
    <v-divider
      class="mx-2"
      vertical/>
    <xor-apps class="function"/>
  </v-layout>
</template>

<script>
import XorTimer from '~/components/xor-timer.vue'
import XorCalendar from '~/components/xor-calendar.vue'
import XorTask from '~/components/xor-task.vue'
import XorAssistant from '~/components/xor-assistant.vue'
import XorApps from '~/components/xor-apps.vue'
export default {
  components: {
    XorTimer,
    XorCalendar,
    XorTask,
    XorAssistant,
    XorApps
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
