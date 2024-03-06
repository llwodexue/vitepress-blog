import type { Router } from 'vitepress'
import { watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'

declare module 'medium-zoom' {
  interface Zoom {
    refresh: (selector?: string) => void
  }
}

const defaultSelector = ':not(a) > img:not(.image-src, .vp-sponsor-grid-image)'

export const createMediumZoom = (router: Router) => {
  const zoom = mediumZoom()
  zoom.refresh = (selector = defaultSelector) => {
    zoom.detach()
    zoom.attach(selector)
  }

  watch(
    () => router.route.path,
    () => nextTick(() => zoom.refresh())
  )
}
