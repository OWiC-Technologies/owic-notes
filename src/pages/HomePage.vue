<style scoped lang="scss" src="./HomePage.scss"></style>

<template>
  <q-page class="full-width column q-px-lg q-pt-md">
    <div class="full-width column self-center" style="max-width: 60em">
      <q-fab
        vertical-actions
        color="primary"
        icon="mdi-plus"
        active-icon="mdi-close"
        direction="up"
        class="fixed-bottom-right"
        @click="createNewNote"
      >
      </q-fab>

      <div
        v-show="columnElements[0].length === 0"
        class="full-width column items-center q-pa-lg"
        style="height: 80vh"
      >
        <div
          class="full-width column items-center q-pa-md"
          style="margin: auto auto"
        >
          <q-icon name="mdi-note-text-outline" size="6em" color="primary" />
          <p class="text-subtitle1 text-center text-grey">
            Click here to start your first note!
          </p>
          <q-btn
            class="q-px-sm"
            size="md"
            label="Create New"
            icon="mdi-plus"
            color="primary"
            no-caps
            dense
            @click="createNewNote"
          />
        </div>
      </div>

      <div class="full-width row" v-if="columnElements[0].length !== 0">
        <div
          class="full-width col"
          v-for="(column, index) in columnElements"
          v-bind:key="index"
        >
          <div
            class="item-container q-pa-sm"
            v-for="(item, index) in column"
            v-bind:key="index"
          >
            <NotePreview :content="item.content" @click="clickNote(item.id)" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { OWiCConnect } from "owic-app-service";
import NotePreview from "src/components/NotePreview.vue";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "HomePage",
  components: {
    NotePreview,
  },
  setup(props) {
    const $q = useQuasar();
    const loggedIn = ref(false);
    const router = useRouter();
    // UI Properties
    const uploaderRef = ref();
    const selectMode = ref(false);
    const selectedList = ref([]);
    const columnElements = ref([[], []]);
    // File Variables
    const notesList = ref([]);

    function updateColumns() {
      const columnImages = [[], []];
      notesList.value.forEach((note, index) => {
        columnImages[index % 2].push(note);
      });
      columnElements.value = columnImages;
    }

    const clickNote = (id) => {
      let saveIndex = notesList.value.findIndex((note) => note.id == id);
      if (saveIndex !== -1) {
        let noteId = notesList.value[saveIndex].id;
        router.push({
          name: "edit",
          params: {
            noteId: noteId,
          },
        });
      }
    };

    const createNewNote = async () => {
      if (loggedIn.value) {
        let noteId = uuidv4();
        const emptyNote = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "New note!",
                },
              ],
            },
          ],
        };

        notesList.value.push({ id: noteId, content: emptyNote });
        await OWiCConnect.setData("notes", notesList.value);

        router.push({
          name: "edit",
          params: {
            noteId: noteId,
          },
        });
      } else {
        router.push({ path: "/login" });
      }
    };

    const toggleSelectMode = () => {
      selectMode.value = !selectMode.value;
      selectedList.value = [];
    };

    onMounted(async () => {
      const response = await OWiCConnect.getData("notes");
      if (Symbol.iterator in Object(response)) {
        notesList.value.push(...response);
        updateColumns();
      }

      const checkLoggedIn = await OWiCConnect.getUser();
      if (checkLoggedIn.errors.length == 0) {
        loggedIn.value = true;
      }
    });

    return {
      selectMode,
      selectedList,
      uploaderRef,
      columnElements,
      clickNote,
      createNewNote,
      toggleSelectMode,
    };
  },
});
</script>
