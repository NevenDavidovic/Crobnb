// plugins/toast.ts
import { defineNuxtPlugin } from "#app";
import Toast, {
  POSITION,
  createToastInterface,
  type PluginOptions,
} from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  // Configure toast options
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  };

  // Install the plugin to the Vue app
  nuxtApp.vueApp.use(Toast, options);

  // Create toast interface
  const toast = createToastInterface(options);

  // Provide the toast interface
  return {
    provide: {
      toast,
    },
  };
});
