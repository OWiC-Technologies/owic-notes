<template>
  <q-layout
    view="lHh Lpr lFf"
    :class="[safeArea ? 'safe-area' : 'no-safe-area']"
  >
    <q-header class="bg-white text-dark q-py-md">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          size="lg"
          icon="mdi-arrow-left"
          aria-label="Back"
          @click="backPressed"
        />

        <q-toolbar-title class="text-center">
          <q-avatar size="xl">
            <img src="~assets/notes_square_logo.svg" />
          </q-avatar>
        </q-toolbar-title>

        <q-btn
          v-if="!photoUrl"
          flat
          round
          dense
          size="lg"
          icon="mdi-account"
          @click="toUser"
        />
        <q-avatar v-else size="lg">
          <img :src="photoUrl" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from "vue";
import { OWiCConnect, OWICPlatform } from "owic-app-service";

export default defineComponent({
  name: "SubLayout",
  setup() {
    const safeArea = computed(() => {
      return OWiCConnect.getPlatform() == OWICPlatform.APP;
    });
    const photoUrl = ref("");

    onMounted(async () => {
      const response = await OWiCConnect.getUser();
      if (response.errors.length == 0) {
        let userObject = response.data[Object.keys(response.data)[0]];
        if (userObject.photoURL) {
          photoUrl.value = userObject.photoURL;
        }
      }
    });

    return {
      photoUrl,
      safeArea,
    };
  },
  methods: {
    backPressed() {
      this.$router.push({ path: "/" });
    },
    toUser() {
      this.$router.push("/login");
    },
  },
});
</script>
