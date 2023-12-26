<style scoped lang="scss" src="./HomePage.scss"></style>

<template>
  <q-page class="full-width column q-px-lg q-pt-md">
    <div class="full-width column self-center" style="max-width: 60em">
      <q-fab
        v-if="!isDragging"
        vertical-actions
        color="primary"
        icon="mdi-plus"
        active-icon="mdi-close"
        direction="up"
        class="fixed-bottom-right"
        @click="createNewNote"
      />
      <div v-else>
        <draggable
          class="fixed-bottom-right"
          style="height: 5rem; width: 5rem; z-index: 991"
          v-model="deleteElements"
          group="notes"
          item-key="id"
          @change="updateColumns"
          @start="startDrag"
          @end="endDrag"
        >
          <template #item="{ element }">
            <div style="display: none">{{ element.content }}</div>
          </template>
        </draggable>
        <q-fab
          vertical-actions
          color="negative"
          icon="mdi-delete"
          direction="up"
          class="fixed-bottom-right"
          @dragover.prevent
          @drop="deleteNote"
        />
      </div>

      <div
        v-show="
          columnElements[0].length === 0 && columnElements[1].length === 0
        "
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

      <div
        class="full-width row"
        style="height: 80vh"
        v-if="columnElements[0].length !== 0 || columnElements[1].length !== 0"
      >
        <div
          class="full-width col"
          v-for="(column, index) in columnElements"
          v-bind:key="index"
        >
          <draggable
            style="height: 100%"
            v-model="columnElements[index]"
            group="notes"
            item-key="id"
            @change="updateColumns"
            @start="startDrag"
            @end="endDrag"
          >
            <template #item="{ element }">
              <div class="item-container q-pa-xs">
                <NotePreview
                  :content="element.content"
                  @click="clickNote(element.id)"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { OWiCConnect } from "owic-app-service";
import { useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import draggable from "vuedraggable";
import NotePreview from "src/components/NotePreview.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    NotePreview,
    draggable,
  },
  setup(props) {
    const $q = useQuasar();
    const loggedIn = ref(false);
    const router = useRouter();
    // UI Properties
    const uploaderRef = ref();
    const isDragging = ref(false);
    const columnElements = ref([[], []]);
    const deleteElements = ref([]);
    // File Variables
    const notesList = ref([]);

    function setColumns() {
      const columnImages = [[], []];
      notesList.value.forEach((note, index) => {
        if (note.pos) {
          columnImages[note.pos[0]].push(note);
        } else {
          columnImages[index % 2].push(note);
        }
      });
      columnElements.value = columnImages;
    }

    function updateColumns(e) {
      for (let i = 0; i < columnElements.value.length; i++) {
        for (let j = 0; j < columnElements.value[i].length; j++) {
          columnElements.value[i][j].pos = [i, j];
        }
      }

      notesList.value = [];
      let i,
        l = Math.min(
          columnElements.value[0].length,
          columnElements.value[1].length
        );

      for (i = 0; i < l; i++) {
        notesList.value.push(
          columnElements.value[0][i],
          columnElements.value[1][i]
        );
      }
      notesList.value.push(
        ...columnElements.value[0].slice(l),
        ...columnElements.value[1].slice(l)
      );
      OWiCConnect.setData("notes", notesList.value);
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
                  text: "",
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

    const startDrag = (e) => {
      isDragging.value = true;
      console.log(e);
    };

    const endDrag = (e) => {
      isDragging.value = false;
      console.log(e);
    };

    onMounted(async () => {
      const response = await OWiCConnect.getData("notes");
      if (Symbol.iterator in Object(response)) {
        notesList.value.push(...response);
        setColumns();
      }

      const checkLoggedIn = await OWiCConnect.getUser();
      if (checkLoggedIn.errors.length == 0) {
        loggedIn.value = true;
      }
    });

    return {
      isDragging,
      uploaderRef,
      columnElements,
      deleteElements,
      clickNote,
      createNewNote,
      startDrag,
      endDrag,
      updateColumns,
    };
  },
});
</script>
