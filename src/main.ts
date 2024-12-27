import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";
import piniaPluginPersist from "pinia-plugin-persist";
// 导入视频播放组件
import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import VueCookies from "vue-cookies";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "element-plus/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
//修改分页器默认文字
zhCn.el.pagination.goto = "跳转";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
const pinia = createPinia(); // 创建 Pinia 实例并挂载
pinia.use(piniaPluginPersist); // 注册持久化插件
// 视频播放组件
app.use(VueVideoPlayer);
app.use(router);
app.use(VueCookies);
app.use(pinia);
app.use(ElementPlus, { locale: zhCn });
app.mount("#app");
