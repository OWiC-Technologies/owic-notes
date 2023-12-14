<template>
  <q-header style="background-color: transparent">
    <div class="row items-center q-pt-lg">
      <img style="height: 4em" src="~assets/owic_logo_sm.png" />
    </div>
  </q-header>
  <q-page class="full-width column q-px-lg q-pt-md">
    <div
      class="full-width column self-center"
      style="max-width: 60em; height: 70vh; justify-content: space-between"
    >
      <div />
      <div class="column self-center items-center" style="max-width: 30em">
        <h2 class="text-h5 header-font q-my-sm" style="font-size: 16pt">
          Let's get started{{ nameInsert }}!
        </h2>
        <p class="text-subtitle1">Sign in below to start creating</p>

        <q-btn
          color="white"
          text-color="grey-8"
          icon="mdi-google"
          label="Continue with Google"
          class="q-my-sm full-width"
          @click="loginWithGoogle"
          no-caps
        />
        <!-- <q-btn
          color="blue-7"
          text-color="white"
          icon="mdi-facebook"
          label="Continue with Facebook"
          class="q-my-sm full-width"
          no-caps
        /> -->
        <q-btn
          color="black"
          text-color="white"
          icon="mdi-apple"
          label="Continue with Apple"
          class="q-my-sm full-width"
          @click="loginWithApple"
          no-caps
        />
      </div>
      <div />
    </div>
  </q-page>
  <q-footer style="background-color: transparent">
    <div class="full-width column items-center q-pb-lg">
      <p class="header-font q-mb-sm" style="font-size: small; color: black">
        powered by
      </p>
      <q-img src="~assets/owic_logo_sm.png" width="5em" />
    </div>
  </q-footer>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { OWiCConnect, OWiCLoginTypes } from "owic-app-service";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const router = useRouter();
    const nameInsert = ref("");

    onMounted(async () => {
      const response = await OWiCConnect.getUser();
      if (response.errors.length == 0) {
        router.back();
      }

      let giverParams = localStorage.getItem("giverParams");
      if (giverParams) {
        let params = JSON.parse(giverParams);
        if (params.giver) nameInsert.value = `, ${params.giver}`;
      }
    });

    return {
      nameInsert,
    };
  },
  methods: {
    async loginWithGoogle() {
      const response = await OWiCConnect.requestLogin(OWiCLoginTypes.GOOGLE);
      console.log(response);
      if (response.errors.length == 0) {
        this.$router.back();
      }
    },
    async loginWithApple() {
      const response = await OWiCConnect.requestLogin(OWiCLoginTypes.APPLE);
      console.log(response);
      if (response.errors.length == 0) {
        this.$router.back();
      }
    },
  },
});
</script>
