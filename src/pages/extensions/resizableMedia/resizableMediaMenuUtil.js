import { mdiDelete, mdiFormatAlignCenter, mdiFormatAlignLeft, mdiFormatAlignRight, mdiFormatFloatLeft, mdiFormatFloatRight } from '@quasar/extras/mdi-v7';


export const resizableMediaActions = [
  {
    tooltip: "Align left",
    action: updateAttributes =>
      updateAttributes({
        dataAlign: "left",
        dataFloat: null
      }),
    icon: mdiFormatAlignLeft,
    isActive: attrs => attrs.dataAlign === "left"
  },
  {
    tooltip: "Align center",
    action: updateAttributes =>
      updateAttributes({
        dataAlign: "center",
        dataFloat: null
      }),
    icon: mdiFormatAlignCenter,
    isActive: attrs => attrs.dataAlign === "center"
  },
  {
    tooltip: "Align right",
    action: updateAttributes =>
      updateAttributes({
        dataAlign: "right",
        dataFloat: null
      }),
    icon: mdiFormatAlignRight,
    isActive: attrs => attrs.dataAlign === "right"
  },
  {
    tooltip: "Float left",
    action: updateAttributes =>
      updateAttributes({
        dataAlign: null,
        dataFloat: "left"
      }),
    icon: mdiFormatFloatLeft,
    isActive: attrs => attrs.dataFloat === "left"
  },
  {
    tooltip: "Float right",
    action: updateAttributes =>
      updateAttributes({
        dataAlign: null,
        dataFloat: "right"
      }),
    icon: mdiFormatFloatRight,
    isActive: attrs => attrs.dataFloat === "right"
  },
  {
    tooltip: "Delete",
    icon: mdiDelete,
    delete: deleteNode => deleteNode()
  }
]
