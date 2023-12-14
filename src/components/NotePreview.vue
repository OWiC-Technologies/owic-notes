<template>
  <div class="preview-card">
    <editor-content class="preview column items-center" :editor="editor" />
  </div>
</template>

<style lang="scss">
.preview-card {
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  overflow: visible;
  background-color: white;
  min-height: 10em;
}

.preview .tiptap {
  padding: 1em 1em;
  width: 100%;
  max-height: 30vh;
  overflow: hidden;
}
</style>

<script>
import { defineComponent } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
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

export default defineComponent({
  name: "NotePreview",
  components: {
    EditorContent,
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const editor = useEditor({
      content: props.content,
      editable: false,
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
        Placeholder,
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
    });

    return {
      editor,
    };
  },
});
</script>
