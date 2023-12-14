<template>
  <q-layout>
    <q-page-container
      :class="[safeArea ? 'safe-area-fullscreen' : 'no-safe-area', 'bg-white']"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { OWiCConnect, OWICPlatform } from "owic-app-service";
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "FullscreenLayout",
  setup() {
    const safeArea = computed(() => {
      return OWiCConnect.getPlatform() == OWICPlatform.APP;
    });

    return {
      safeArea,
    };
  },
});
</script>
