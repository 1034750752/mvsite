<template>
    <div class="play-content" @mousemove="showTitle">
        <h2 ref="titleElement" :style="{ opacity: titleOpacity }" class="title">
            {{ mv.title }}
            <span v-if="!(mv.type === '电影')">第{{ FormatNum(i) }}集</span>
        </h2>
        <video-player :src="url" :options="playerOptions" :volume="0.6">
        </video-player>
        <div class="play-tab" ref="tabBox">
            <h2>
                <a :href="routeTitle(mv.mvId)">{{ mv.title }}</a>
            </h2>
            <div class="slid-playbox">
                <div class="play_jump" v-if="parseInt(mv.quality, 10)">
                    <span><a :href="backORnext(i)">上一集</a></span>
                    <span><a :href="backORnext(i, 'next')">下一集</a></span>
                </div>
                <div v-else style="margin-bottom: 30px"></div>
                <ul class="showplayul" v-if="parseInt(mv.quality, 10)">
                    <li
                        v-for="(item, value) in range(parseInt(mv.quality, 10))"
                        :key="value"
                    >
                        <a
                            :href="changeNum(item)"
                            :class="{ on: Number(item) === Number(i) }"
                            >第{{ FormatNum(item) }}集</a
                        >
                    </li>
                </ul>
                <ul class="showplayul" v-else>
                    <li>
                        <a class="on">正片</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
  
  <script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, nextTick, computed } from "vue";
import { changeTit } from "../utils/changeTit";
import axios from "../store/axios";
import { getType } from "../utils/MvPublic";
import { FormatNum, range } from "../utils/public";
// 视频链接地址
const route = useRoute();
const id_i = ref(route.params.id_i.split("_"));
const id = id_i.value[0];
const i = id_i.value[1];

// 视频源设置
const mv = ref({});
const server = process.env.VUE_APP_VIDEO_URL;
//视频链接
const url = computed(() => {
    if (parseInt(mv.value.quality, 10)) {
        return `${server}videos/${id}/${FormatNum(i)}/index.mp4`;
    }
    return `${server}videos/${id}/index.mp4`;
});
// 控制标题的透明度
const titleOpacity = ref(0);
let autoPlay = null;
// 视频播放器配置
const playerOptions = ref({
    height: 100,
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
// 当前集数的高亮逻辑和滚动
const tabBox = ref(null); // 滚动容器的引用
// 跳转集数
const changeNum = (num) => {
    return `/play/${id}_${num}`;
};

// 滚动到当前集数
const scrollToCurrentEpisode = () => {
    nextTick(() => {
        const tabContainer = tabBox.value; // 获取滚动容器
        const currentElement = tabContainer.querySelector(".showplayul .on"); // 获取带有 `on` 样式的元素
        if (currentElement) {
            currentElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
    });
};
// 上一集 下一集
const backORnext = (i, bt = "back") => {
    if (bt === "back") {
        return `/play/${id}_${parseInt(i, 10) - 1}`;
    } else if (bt === "next") {
        return `/play/${id}_${parseInt(i, 10) + 1}`;
    }
};
// 标题跳转
const routeTitle = (id) => {
    const name = getType(mv.value.type);
    return `/${name}/${id}`;
};
// 获取数据
const fetchData = async () => {
    try {
        const response2 = await axios.get("/mv/mvdt", {
            params: { mvId: id, search: 1 },
        });
        mv.value = response2.data.data.list[0];
        console.log();
        // 改变标题
        const episode = i === "" ? "HD" : `第${i}集`;
        const playTitle = ref(
            mv.value.title + " " + episode + " | " + process.env.VUE_APP_NAME
        );
        changeTit(playTitle);

        // 滚动到当前集数
        scrollToCurrentEpisode();
    } catch (error) {
        console.error("fetchData error", error);
    }
};
// 在组件挂载时获取数据
onMounted(async () => {
    await fetchData();
});
</script>
<style lang="css" scoped>
@import "@/assets/css/play.css";
</style>