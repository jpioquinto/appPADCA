import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from './router'

import './assets/css/bootstrap.min.css'
import './assets/css/app/plugins.min.css'
import './assets/css/app/kaiadmin.min.css'
import './assets/css/app.css'
// quitar las dos líneas siguientes
//import './index.css'
//import App from './App.tsx'
import './assets/css/fonts.min.css'
import WebFont from 'webfontloader'

WebFont.load({
  google: {"families":["Lato:300,400,700,900"]},
  custom: {"families":["Font Awesome 5 Solid", "Font Awesome 5 Regular", "Font Awesome 5 Brands", "simple-line-icons"], urls: [`./assets/css/fonts.min.css`]},
  active: () => sessionStorage.fonts = true
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
