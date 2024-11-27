import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";

// 导入视频播放组件
import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import VueCookies from "vue-cookies";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import "element-plus/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
//修改分页器默认文字
zhCn.el.pagination.goto = "跳转";
const app = createApp(App);

// 视频播放组件
app.use(VueVideoPlayer);
app.use(router);
app.use(VueCookies);
app.use(ElementPlus, { locale: zhCn });
app.use(store);
app.mount("#app");
