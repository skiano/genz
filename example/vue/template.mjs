import {
  ssrRenderClass as _ssrRenderClass,
  ssrRenderAttrs as _ssrRenderAttrs,
  ssrInterpolate as _ssrInterpolate
} from "vue/server-renderer"

export default {
  data: () => ({
    v1: 'v 1',
    v2: 'v 2',
    v3: 'v 3',
  }),
  ssrRender: function ssrRender(_ctx, _push, _parent, _attrs) {
    _push(`<html${
      _ssrRenderAttrs(_attrs)
    }><head><title>${
      _ssrInterpolate(_ctx.v2)
    }</title></head><body><p class="${
      _ssrRenderClass(_ctx.v3)
    }">${
      _ssrInterpolate(_ctx.v1)
    }</p></body></html>`)
  }
}