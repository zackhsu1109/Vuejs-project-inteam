import { createApp } from "vue";
import App from "./App.vue";

// Create app first
const app = createApp(App);

// Ant Design Vue
import { Button, Dropdown, Menu } from 'ant-design-vue';
app.use(Button);
app.use(Dropdown);
app.use(Menu);

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                },
            },
        },
    },
});

// Router
import router from "./router";

// Pinia
import { createPinia } from "pinia";
const pinia = createPinia();

// Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFileShield, faUser, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faFileShield, faUser, faShieldAlt);
import "@fortawesome/fontawesome-free/css/all.min.css";


// Use plugins
app.use(vuetify);
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.component("font-awesome-icon", FontAwesomeIcon);

// Mount app
app.mount('#app');