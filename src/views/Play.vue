<template>
    <div class="play-content" @mousemove="showTitle">
        <h2 ref="titleElement" :style="{ opacity: titleOpacity }" class="title">
            {{ mv.title }}
            <span v-if="!(mv.type === '电影')">第{{ getNum(i) }}集</span>
        </h2>
        <video-player
            src="../../public/video/1.mp4"
            :options="playerOptions"
            :volume="0.6"
        >
        </video-player>
    </div>
</template>
  
  <script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "../store/axios";
// 视频链接地址
const route = useRoute();
const id_i = route.params.id_i.split("_");
const id = id_i[0];
const i = id_i[1];
console.log(id);
// 视频源设置
const cate = "mp4";
const mv = ref({});
const server = process.env.VUE_APP_VIDEO_URL;
const url = `${server}${id}/${id}_${i}.${cate}`;
const videoSrc = ref(url);
// 控制标题的透明度
const titleOpacity = ref(0);
let autoPlay = null;

// 视频播放器配置
const playerOptions = ref({
    // height: 200,
    // width: document.documentElement.clientWidth, //播放器宽度
    playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
    autoplay: "any", // 如果true,浏览器准备好时开始回放。
    muted: false, // 默认情况下将会消除任何音频。
    loop: false, // 导致视频一结束就重新开始。
    preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: "zh-CN",
    aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
    controls: true,
    controlBar: {
        timeDivider: true,
        durationDisplay: true,
        remainingTimeDisplay: false,
        fullscreenToggle: true, // 全屏按钮
    },
});

// 设置标题自动隐藏
const hideTitle = () => {
    autoPlay = setTimeout(() => {
        titleOpacity.value = 0; // 改变透明度来隐藏标题
    }, 2500);
};
// 清除定时器
const clearSetTimeout = () => clearTimeout(autoPlay);
// 显示标题
const showTitle = () => {
    clearSetTimeout();
    titleOpacity.value = 1; // 显示标题
    hideTitle(); // 在 2.5 秒后隐藏标题
};
// 格式化数字
const getNum = (num) => {
    return (num = parseInt(num) < 10 ? "0" + num : num);
};
// 获取数据
const fetchData = async () => {
    try {
        const response2 = await axios.get("/mv/mvdt", {
            params: { mvId: id, search: 1 },
        });
        mv.value = response2.data.data.list[0];
        console.log(mv.value);
    } catch (error) {
        console.error("fetchData error", error);
    }
};
// 在组件挂载时获取数据
onMounted(() => {
    fetchData();
});
</script>
<style scoped>
.play-content {
    position: relative;
}
.title {
    position: absolute;
    z-index: 999;
    font-size: 22px;
    width: 100%;
    left: 0;
    top: 0;
    margin: 0;
    padding: 15px 0 15px 20px;
    color: white;
    font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, Roboto, Arial,
        sans-serif;
    font-weight: normal;
    background-color: rgba(43, 51, 63, 0.7);
    transition: opacity 0.3s; /* 控制透明度渐变效果 */
}
</style>