import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: '#31a974',
            secondary: '#2196f3',
            background: '#323233',
            surface: '#2a2a2a',
            error: '#f44336',
            info: '#2196f3',
            success: '#31a974',
            warning: '#ffc107',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
