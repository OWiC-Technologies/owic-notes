<script>
import { ref, onMounted, computed, watch } from "vue";
import { Editor, Node, NodeViewWrapper } from "@tiptap/vue-3";
import { Tippy, directive } from "vue-tippy";

import { resizableMediaActions } from "./resizableMediaMenuUtil";

export default {
  directives: {
    tippy: directive,
  },
  components: {
    NodeViewWrapper,
    Tippy,
  },
  props: {
    editor: Object,
    node: {
      type: Object,
      required: true,
    },
    decorations: Object,
    selected: Boolean,
    extension: Object,
    getPos: Function,
    updateAttributes: Function,
    deleteNode: Function,
  },
  setup(props) {
    const mediaType = computed(() => props.node.attrs["media-type"]);
    const resizableImg = ref(null); // template ref
    const aspectRatio = ref(0);
    const proseMirrorContainerWidth = ref(0);
    const mediaActionActiveState = ref({});

    const isFloat = computed(() => !!props.node.attrs.dataFloat);

    const isAlign = computed(() => !!props.node.attrs.dataAlign);

    const setMediaActionActiveStates = () => {
      const activeStates = {};

      for (const { tooltip, isActive } of resizableMediaActions) {
        activeStates[tooltip] = !!isActive?.(props.node.attrs);
      }

      mediaActionActiveState.value = activeStates;
    };

    watch(
      () => props.node.attrs,
      () => setMediaActionActiveStates(),
      { deep: true }
    );

    const mediaSetupOnLoad = () => {
      const proseMirrorContainerDiv = document.querySelector(".ProseMirror");

      if (proseMirrorContainerDiv) {
        proseMirrorContainerWidth.value = proseMirrorContainerDiv.clientWidth;
      }

      if (!resizableImg.value) return;

      const onLoadFunction = () => {
        aspectRatio.value =
          mediaType.value === "video"
            ? resizableImg.value.videoWidth / resizableImg.value.videoHeight
            : resizableImg.value.naturalWidth /
              resizableImg.value.naturalHeight;

        onHorizontalResize("left", 0);
      };

      if (mediaType.value === "video") {
        setTimeout(onLoadFunction, 200);
      } else {
        resizableImg.value.onload = onLoadFunction;
      }

      setTimeout(() => setMediaActionActiveStates(), 200);
    };

    onMounted(() => mediaSetupOnLoad());

    const isHorizontalResizeActive = ref(false);
    const lastCursorX = ref(-1);

    const limitWidthOrHeightToFiftyPixels = ({ width, height }) =>
      width < 100 || height < 100;

    const startHorizontalResize = (e) => {
      isHorizontalResizeActive.value = true;
      lastCursorX.value = e.clientX;

      document.addEventListener("mousemove", onHorizontalMouseMove);
      document.addEventListener("mouseup", stopHorizontalResize);
    };

    const stopHorizontalResize = () => {
      isHorizontalResizeActive.value = false;
      lastCursorX.value = -1;

      document.removeEventListener("mousemove", onHorizontalMouseMove);
      document.removeEventListener("mouseup", stopHorizontalResize);
    };

    const onHorizontalResize = (directionOfMouseMove, diff) => {
      if (!resizableImg.value) {
        console.error("Media ref is undefined|null", {
          resizableImg: resizableImg.value,
        });
        return;
      }

      const currentMediaDimensions = {
        width: resizableImg.value.width,
        height: resizableImg.value.height,
      };

      const newMediaDimensions = { width: -1, height: -1 };

      if (directionOfMouseMove === "left") {
        newMediaDimensions.width =
          currentMediaDimensions.width - Math.abs(diff);
      } else {
        newMediaDimensions.width =
          currentMediaDimensions.width + Math.abs(diff);
      }

      if (newMediaDimensions.width > proseMirrorContainerWidth.value) {
        newMediaDimensions.width = proseMirrorContainerWidth.value;
      }

      newMediaDimensions.height = newMediaDimensions.width / aspectRatio.value;

      if (limitWidthOrHeightToFiftyPixels(newMediaDimensions)) return;

      props.updateAttributes(newMediaDimensions);
    };

    const onHorizontalMouseMove = (e) => {
      if (!isHorizontalResizeActive.value) return;

      const diff = lastCursorX.value - e.clientX;
      lastCursorX.value = e.clientX;

      if (diff === 0) return;

      const directionOfMouseMove = diff > 0 ? "left" : "right";
      onHorizontalResize(directionOfMouseMove, Math.abs(diff));
    };

    const isVerticalResizeActive = ref(false);
    const lastCursorY = ref(-1);

    const startVerticalResize = (e) => {
      isVerticalResizeActive.value = true;
      lastCursorY.value = e.clientY;

      document.addEventListener("mousemove", onVerticalMouseMove);
      document.addEventListener("mouseup", stopVerticalResize);
    };

    const stopVerticalResize = () => {
      isVerticalResizeActive.value = false;
      lastCursorY.value = -1;

      document.removeEventListener("mousemove", onVerticalMouseMove);
      document.removeEventListener("mouseup", stopVerticalResize);
    };

    const onVerticalMouseMove = (e) => {
      if (!isVerticalResizeActive.value) return;

      const diff = lastCursorY.value - e.clientY;
      lastCursorY.value = e.clientY;

      if (diff === 0) return;

      const directionOfMouseMove = diff > 0 ? "up" : "down";

      if (!resizableImg.value) {
        console.error("Media ref is undefined|null", {
          resizableImg: resizableImg.value,
        });
        return;
      }

      const currentMediaDimensions = {
        width: resizableImg.value.width,
        height: resizableImg.value.height,
      };

      const newMediaDimensions = { width: -1, height: -1 };

      if (directionOfMouseMove === "up") {
        newMediaDimensions.height =
          currentMediaDimensions.height - Math.abs(diff);
      } else {
        newMediaDimensions.height =
          currentMediaDimensions.height + Math.abs(diff);
      }

      newMediaDimensions.width = newMediaDimensions.height * aspectRatio.value;

      if (newMediaDimensions.width > proseMirrorContainerWidth.value) {
        newMediaDimensions.width = proseMirrorContainerWidth.value;
        newMediaDimensions.height =
          newMediaDimensions.width / aspectRatio.value;
      }

      if (limitWidthOrHeightToFiftyPixels(newMediaDimensions)) return;

      props.updateAttributes(newMediaDimensions);
    };

    return {
      // Reactive references
      resizableImg,
      aspectRatio,
      proseMirrorContainerWidth,
      mediaActionActiveState,
      isHorizontalResizeActive,
      lastCursorX,
      isVerticalResizeActive,
      lastCursorY,

      // Computed properties
      mediaType,
      isFloat,
      isAlign,

      // Methods
      setMediaActionActiveStates,
      mediaSetupOnLoad,
      startHorizontalResize,
      stopHorizontalResize,
      onHorizontalResize,
      onHorizontalMouseMove,
      startVerticalResize,
      stopVerticalResize,
      onVerticalMouseMove,
      resizableMediaActions,

      // Any other methods or reactive states that you want to use in the template...
    };
  },
};
</script>

<template>
  <node-view-wrapper
    as="article"
    class="media-node-view flex pos-relative not-prose"
    :class="[
      `${(isFloat && `f-${node.attrs.dataFloat}`) || ''}`,
      `${(isAlign && `align-${node.attrs.dataAlign}`) || ''}`,
    ]"
  >
    <tippy :interactive="true">
      <div class="w-fit flex relative">
        <img
          v-if="mediaType === 'img'"
          v-bind="node.attrs"
          ref="resizableImg"
          class="rounded-lg"
          :class="[
            `${(isFloat && `float-${node.attrs.dataFloat}`) || ''}`,
            `${(isAlign && `align-${node.attrs.dataAlign}`) || ''}`,
          ]"
          draggable="true"
        />

        <video
          v-else-if="mediaType === 'video'"
          v-bind="node.attrs"
          ref="resizableImg"
          class="rounded-lg"
          :class="[
            `${(isFloat && `float-${node.attrs.dataFloat}`) || ''}`,
            `${(isAlign && `align-${node.attrs.dataAlign}`) || ''}`,
          ]"
          draggable="true"
          controls="true"
        >
          <source :src="node.attrs.src" />
        </video>

        <div
          class="horizontal-resize-handle"
          :class="{ 'horizontal-resize-active': isHorizontalResizeActive }"
          title="Resize"
          @mousedown="startHorizontalResize"
          @mouseup="stopHorizontalResize"
        />

        <div
          class="vertical-resize-handle"
          :class="{ 'vertical-resize-active': isVerticalResizeActive }"
          title="Resize"
          @mousedown="startVerticalResize"
          @mouseup="stopVerticalResize"
        />
      </div>

      <template #content>
        <section class="image-actions-container">
          <q-btn
            v-for="(mediaAction, i) in resizableMediaActions"
            :key="i"
            :icon="mediaAction.icon"
            padding="xs"
            color="primary"
            @click="
              mediaAction.tooltip === 'Delete'
                ? mediaAction.delete?.(deleteNode)
                : mediaAction.action?.(updateAttributes)
            "
          />
        </section>
      </template>
    </tippy>
  </node-view-wrapper>
</template>

<style scoped lang="scss">
.relative {
  position: relative;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.media-node-view {
  position: relative;

  &.f-left {
    float: left;
  }

  &.f-right {
    float: right;
  }

  &.align-left {
    justify-content: start;
  }

  &.align-center {
    justify-content: center;
  }

  &.align-right {
    justify-content: end;
  }

  .horizontal-resize-handle,
  .vertical-resize-handle {
    position: absolute;
    z-index: 50;
    opacity: 0.5;

    &:hover {
      background-color: #ffffff88;
    }
  }

  .horizontal-resize-handle {
    height: 100%;
    width: 1em;
    top: 0;
    right: 0;
    cursor: col-resize;
  }

  .vertical-resize-handle {
    width: 100%;
    height: 1em;
    bottom: 0;
    left: 0;
    cursor: row-resize;
  }
}

.image-actions-container {
  display: flex;
  gap: 0.25em;
}

.media-actions-container {
  padding: 4px !important;
  width: fit-content !important;

  .ep-button + .ep-button {
    margin-left: 0px;
  }
}
</style>
