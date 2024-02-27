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
          icon="mdi-menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
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

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list class="q-py-md">
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { OWiCConnect, OWICPlatform } from "owic-app-service";

const linksList = [
  {
    title: "Return to OWiC",
    icon: "mdi-arrow-left-bold-box-outline",
    action: () => {
      OWiCConnect.leaveApp();
    },
  },
  // {
  //   title: "Need help?",
  //   icon: "mdi-face-agent",
  //   action: () => {
  //     window.open("https://owictech.com/support", "_blank");
  //   },
  // },
  // {
  //   title: "About",
  //   icon: "mdi-information-outline",
  // },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const safeArea = computed(() => {
      return (
        OWiCConnect.getPlatform() == OWICPlatform.APP &&
        OWiCConnect.getVersion() === "1.0.0"
      );
    });
    const leftDrawerOpen = ref(false);
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
      safeArea,
      essentialLinks: linksList,
      leftDrawerOpen,
      photoUrl,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  methods: {
    toUser() {
      this.$router.push("/login");
    },
  },
});
</script>
