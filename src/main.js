import { createApp } from 'vue'
import App from './App.vue'
import { loadFonts } from './plugins/webfontloader'

import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faRemove, faCheck } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPlay, faRemove, faCheck);
loadFonts()

const app = createApp(App)
app.use(BootstrapVue3)
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app')
