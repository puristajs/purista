import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
  setup() {
    const css = document.createElement('link')
    css.href = '/cookieconsent.css'
    css.rel = 'stylesheet'
    css.type = 'text/css'
    css.media = 'all'
    document.head.appendChild(css)

    const script = document.createElement('script')
    script.onload = function () {
      const scriptinit = document.createElement('script')
      scriptinit.src = '/cookieconsent-init.js'
      document.body.appendChild(scriptinit)
    }
    script.src = '/cookieconsent.js'

    document.body.appendChild(script)
  },
  rootComponents: [],
})
