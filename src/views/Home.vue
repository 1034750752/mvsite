<template>
    <div>
        <div class="foucebox">
            <div class="bd">
                <div
                    class="showDiv"
                    v-for="(item, index) in bd"
                    :key="index"
                    v-show="autoIndex === index"
                    @mouseenter="stopPlayList"
                    @mouseleave="autoPlayList"
                >
                    <a
                        @click="
                            linkToDt(item.List1.mvId, findName(item.List1.type))
                        "
                    >
                        <picture>
                            <img
                                :src="item.slidImg"
                                class="lazy entered loaded"
                            />
                        </picture>
                    </a>
                    <div class="foucebox_bg">
                        <h3>
                            <a
                                @click="
                                    linkToDt(
                                        item.List1.mvId,
                                        findName(item.List1.type)
                                    )
                                "
                                >{{ item.List1.title }}</a
                            >
                        </h3>
                        <p>{{ item.List2.description }}</p>
                    </div>
                </div>
            </div>
            <div class="hd">
                <ul>
                    <li
                        v-for="(item, index) in bd"
                        :key="index"
                        :class="{ on: autoIndex === index }"
                        @mouseenter="(autoIndex = index), stopPlayList()"
                        @mouseleave="autoPlayList"
                    >
                        <a
                            @click="
                                linkToDt(
                                    item.List1.mvId,
                                    findName(item.List1.type)
                                )
                            "
                        >
                            <div class="img">
                                <picture>
                                    <img :src="item.List2.cover" />
                                </picture>
                            </div>
                            <div class="detail">
                                <div class="title">{{ item.List1.title }}</div>
                                <div class="info">
                                    {{
                                        item.List1.type +
                                        " | " +
                                        item.List1.country
                                    }}
                                </div>
                                <div class="des">
                                    {{ item.List2.description }}
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <RecommendSection
            title="新片推荐"
            :rec="recmv"
            :index="recIndex_mv"
            @change="change"
            name2="mv"
            name="mvdt"
        />
        <RecommendSection
            title="新番推荐"
            :rec="recct"
            :index="recIndex_ct"
            @change="change"
            name2="ct"
            name="ctdt"
        />
        <RecommendSection
            title="新剧推荐"
            :rec="rectv"
            :index="recIndex_tv"
            @change="change"
            name2="tv"
            name="tvdt"
        />
    </div>
</template>

<script setup>
// MainComponent.vue
import { ref, onMounted, watch } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { fetchRecommendData, fetchSlides } from "../utils/api";
import RecommendSection from "../components/Home/RecommendSection.vue";

const recct = ref([]);
const recmv = ref([]);
const rectv = ref([]);
const bd = ref([]);
const loading = ref(false);

const autoIndex = ref(0);
let autoPlay = null;
const totalPages = ref(5);
const recIndex_mv = ref({ value: 1 });
const recIndex_tv = ref({ value: 1 });
const recIndex_ct = ref({ value: 1 });
// 清除原数据
const change = (index) => {
    index.value = index.value === totalPages.value ? 1 : index.value + 1;
    fetchData();
};

const router = useRouter();
const linkToDt = (id, name) => {
    const routeData = router.resolve({
        name: name,
        params: { id: id },
    });
    window.open(routeData.href, "_blank");
};
const findName = (type) => {
    let pathName = "";
    if (type === "电影") {
        pathName = "mvdt";
    } else if (type === "动漫") {
        pathName = "ctdt";
    } else {
        pathName = "tvdt";
    }
    return pathName;
};
const fetchData = async () => {
    try {
        recct.value = await fetchRecommendData(recIndex_ct.value.value, "动漫");
        recmv.value = await fetchRecommendData(recIndex_mv.value.value, "电影");
        rectv.value = await fetchRecommendData(recIndex_tv.value.value, "剧集");
        loading.value = false;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const getBdData = async () => {
    try {
        const { List } = await fetchSlides();
        bd.value = List;
    } catch (error) {
        console.error("Error fetching bd data:", error);
    }
};

const autoPlayList = () => {
    autoPlay = setInterval(() => {
        autoIndex.value = autoIndex.value === 5 ? 0 : autoIndex.value + 1;
    }, 3000);
};

const stopPlayList = () => clearInterval(autoPlay);

onMounted(() => {
    fetchData();
    getBdData();
    autoPlayList();
});

onBeforeRouteUpdate((to, from, next) => {
    fetchData().then(() => {
        getBdData().then(() => {
            autoIndex.value = 0;
            stopPlayList();
            autoPlayList();
            next();
        });
    });
});
watch([recIndex_mv, recIndex_ct, recIndex_tv], () => {
    fetchData();
});
</script>

<style lang="css" scoped>
@import "@/assets/css/mv.css";
@import "@/assets/css/searchResult.css";
</style>
<style scoped>
.on {
    background-color: #e7e7e7;
    border-radius: 5px 5px 5px 5px;
}
</style>