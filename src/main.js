import { createApp } from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import installElementPlus from "@/plugins/element";
import "@/assets/css/icon.css";
import VueAxios from "vue-axios";
import mixins from "@/common/mixin";

const app = createApp(App);
installElementPlus(app);
axios.defaults.baseURL = "https://lianghj.top:8888/api/private/v1/";
// 全局方法

// 全局 mixin
app.mixin(mixins);
app.use(VueAxios, axios);
app.use(store).use(router).mount("#app");
