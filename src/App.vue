<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { OWiCConnect, OWiCAppEmulator } from "owic-app-service";

export default defineComponent({
  name: "App",
  mounted() {
    // Local Testing without OWiC Connect
    // let emulator = new OWiCAppEmulator({ platform: "mobile" });
    // OWiCConnect.initialize({ emulator: emulator });
    OWiCConnect.initialize();
  },
});
</script>
