<template>
  <div class="editor-container">
    <div class="menu-bar" v-if="showOptions">
      <q-btn
        flat
        round
        dense
        icon="mdi-format-list-checks"
        @click="editor.chain().toggleTaskList().run()"
      />
      <q-btn
        flat
        round
        dense
        icon="mdi-format-list-bulleted"
        @click="editor.chain().toggleBulletList().run()"
      />
      <q-btn
        flat
        round
        dense
        icon="mdi-format-list-numbered"
        @click="editor.chain().toggleOrderedList().run()"
      />
      <q-btn flat round dense icon="mdi-link" @click="addLink" />
      <q-btn flat round dense icon="mdi-file-upload" @click="requestUpload" />
      <q-file
        ref="uploaderRef"
        class="invisible-upload"
        multiple
        invisible
        accept="image/avif, image/gif, image/jpeg, image/png, image/webp, image/bmp, video/quicktime, video/webm, video/mpeg, video/mp4"
        v-model="uploaderFiles"
        :filter="checkFile"
        @rejected="onRejectFile"
        @update:model-value="filesUploaded"
      />
    </div>
    <editor-content class="editor column items-center" :editor="editor" />
  </div>
  <q-dialog
    v-model="showLoading"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-white text-dark" style="width: 300px">
      <q-card-section class="column items-center">
        <q-spinner-box color="primary" size="5em" />
        <p class="text-subtitle1 q-mb-md">{{ uploadText }}</p>
        <q-btn
          class="q-px-sm"
          size="md"
          label="Cancel"
          color="negative"
          @click="reqCancelUpload"
          no-caps
          dense
          unelevated
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" src="./NotePage.scss"></style>

<script>
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { toBase64, getThumbnail } from "src/services/utils";
import { OWiCConnect } from "owic-app-service";

import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Focus from "@tiptap/extension-focus";
import FontFamily from "@tiptap/extension-font-family";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Mention from "@tiptap/extension-mention";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { ResizableMedia } from "src/pages/extensions/resizableMedia";

export default {
  components: {
    EditorContent,
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const noteId = route.params.noteId;
    const showOptions = ref(false);

    let notesList = ref([]);

    const uploaderRef = ref();
    const showLoading = ref(false);
    const cancelUpload = ref(true);
    const uploadText = ref("");
    const uploaderFiles = ref([]);

    const saveEditorContent = async ({ editor }) => {
      let saveIndex = notesList.value.findIndex((note) => note.id == noteId);
      if (saveIndex !== -1) {
        notesList.value[saveIndex].content = editor.getJSON();
        await OWiCConnect.setData("notes", notesList.value);
      }
    };

    const editor = useEditor({
      content: "",
      extensions: [
        Blockquote,
        Bold,
        BulletList,
        Code,
        CodeBlock,
        Color,
        Document,
        Dropcursor,
        Focus,
        FontFamily,
        Gapcursor,
        HardBreak,
        Heading,
        Highlight,
        History,
        HorizontalRule,
        Image,
        Italic,
        Link,
        ListItem,
        Mention,
        OrderedList,
        Paragraph,
        Placeholder.configure({
          placeholder: "Start your new note...",
          emptyEditorClass: "is-editor-empty",
        }),
        ResizableMedia,
        Strike,
        Subscript,
        Superscript,
        Table,
        TableCell,
        TableHeader,
        TableRow,
        TaskItem,
        TaskList,
        Text,
        TextAlign,
        TextStyle,
        Underline,
      ],
      onFocus: ({ editor }) => {
        showOptions.value = editor.isFocused;
      },
    });

    onMounted(async () => {
      const response = await OWiCConnect.getData("notes");
      notesList.value.push(...response);

      let saveIndex = notesList.value.findIndex((note) => note.id == noteId);
      if (saveIndex !== -1) {
        let noteId = notesList.value[saveIndex].id;
        let noteContent = notesList.value[saveIndex].content;
        editor.value.commands.setContent(noteContent);
      }
    });

    const checkFile = (files) => {
      return files.filter(
        (file) =>
          ((file.type === "image/avif" ||
            file.type === "image/gif" ||
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/webp" ||
            file.type === "image/bmp") &&
            file.size < 10000000) ||
          ((file.type === "video/quicktime" ||
            file.type === "video/webm" ||
            file.type === "video/mpeg" ||
            file.type === "video/mp4") &&
            file.size < 100000000)
      );
    };

    function addLink() {
      let currentLink = editor.value.getAttributes("link").href;
      $q.dialog({
        dark: true,
        title: "Insert URL",
        prompt: {
          model: currentLink ? editor.value.getAttributes("link").href : "",
          type: "text", // optional
        },
        cancel: true,
        persistent: true,
      }).onOk((url) => {
        if (url) {
          editor.value
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }
      });
    }

    const onRejectFile = (rejectedEntries) => {
      $q.dialog({
        title: "Upload failed",
        message:
          "One or more files surpassed their size limit. Images are limited to 10 MB and videos are limited to 100 MB.",
      });
    };

    function requestUpload() {
      uploaderRef.value.pickFiles();
    }

    const reqCancelUpload = () => {
      cancelUpload.value = true;
      showLoading.value = false;
    };

    const filesUploaded = async () => {
      if (uploaderFiles.value) {
        cancelUpload.value = false;
        showLoading.value = true;
        uploadText.value = "Preparing to upload";

        let uploadProgress = new Array(uploaderFiles.value.length).fill(0);
        await Promise.all(
          uploaderFiles.value.map(async (rawFile, index) => {
            let file64 = await toBase64(rawFile);
            const fileObj = [
              {
                type: rawFile.type,
                name: rawFile.name,
                data: file64,
              },
            ];

            if (cancelUpload.value) {
              return;
            }

            const update = (data) => {
              uploadProgress[index] = data.data.progress;
              let uploadTotal = uploadProgress.reduce(
                (acc, val) => acc + val,
                0
              );
              uploadText.value = `Uploading ${(
                (uploadTotal / uploadProgress.length) *
                100
              ).toFixed(0)}%`;
            };

            const response = await OWiCConnect.uploadMedia(fileObj, update);
            let fileMap = response[0];

            const url = fileMap.url;
            if (fileMap.type.startsWith("image/")) {
              // editor.value.chain().focus().setImage({ src: url }).run();
              editor.value?.commands.setMedia({
                src: url,
                "media-type": "img",

                alt: fileMap.filename,
                title: fileMap.filename,
                width: "800",
                height: "400",
              });
              editor.value?.commands.createParagraphNear();
            } else if (fileMap.type.startsWith("video/")) {
              editor.value?.commands.setMedia({
                src: url,
                "media-type": "video",

                alt: fileMap.filename,
                title: fileMap.filename,
                width: "800",
                height: "400",
              });
              editor.value?.commands.createParagraphNear();
            } else if (fileMap.type.startsWith("audio/")) {
              editor.value.chain().focus().setNode("audio", { src: url }).run();
            }
            return fileMap;
          })
        );
        if (cancelUpload.value == false) {
          cancelUpload.value = true;
          showLoading.value = false;
        }
      }
    };

    onBeforeRouteLeave((to) => {
      if (to.name !== "NotePage") {
        saveEditorContent({ editor: editor.value });
      }
    });

    return {
      editor,
      showOptions,
      uploaderRef,
      uploaderFiles,
      showLoading,
      cancelUpload,
      uploadText,
      addLink,
      reqCancelUpload,
      requestUpload,
      filesUploaded,
      checkFile,
      onRejectFile,
    };
  },
};
</script>
