import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import { createPinia } from "pinia";

// Estilos de PrimeVue
// import ToastService from "primevue/toastservice"; // Importa el servicio de Toast
// import Toast from "primevue/toast"; // Importa el componente Toast

const app = createApp(App);
const pinia = createPinia();

// app.use(ToastService);
app.use(router);
app.use(pinia);
app.mount("#app");
