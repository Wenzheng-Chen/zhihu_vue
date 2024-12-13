import { createApp } from "vue";
import router from "./router";
import store from ".//store";
import axios from "axios";

import App from "./App.vue";

axios.defaults.baseURL = "http://apis.imooc.com/api/";
axios.interceptors.request.use((config) => {
   store.commit("setLoading", true);
   store.commit("setError", { status: false, message: "" });
   config.params = { ...config.params, icode: "5BA9AE8C41E97F94" };
   if (config.data instanceof FormData) {
      config.data.append("icode", "5BA9AE8C41E97F94");
   } else {
      config.data = { ...config.data, icode: "5BA9AE8C41E97F94" };
   }
   return config;
});

axios.interceptors.response.use(
   (config) => {
      store.commit("setLoading", false);
      return config;
   },
   (e) => {
      const { error } = e.response.data;
      store.commit("setError", { status: true, message: error });
      store.commit("setLoading", false);
      return Promise.reject(error);
   }
);

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
