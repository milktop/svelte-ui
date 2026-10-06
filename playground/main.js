import { mount } from 'svelte'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/inter'
import '@fontsource-variable/geist'
import '@fontsource-variable/dm-sans'
import './app.css'
import App from './App.svelte'

mount(App, { target: document.getElementById('app') })
