<template>
    <div>
        <div class="foucebox">
            <div class="bd">
                <div
                    class="showDiv"
                    v-for="(item, index) in fouceList"
                    :key="index"
                    v-show="autoIndex === index"
                    @mouseenter="stopPlayList"
                    @mouseleave="autoPlayList"
                >
                    <a
                        @click="
                            linkToDt(item.bd1.mvId, findName(item.bd1.type))
                        "
                    >
                        <picture>
                            <img
                                :src="cover[index].url"
                                class="lazy entered loaded"
                            />
                        </picture>
                    </a>
                    <div class="foucebox_bg">
                        <h3>
                            <a
                                @click="
                                    linkToDt(
                                        item.bd1.mvId,
                                        findName(item.bd1.type)
                                    )
                                "
                                >{{ item.bd1.title }}</a
                            >
                        </h3>
                        <p>{{ item.bd2.description }}</p>
                    </div>
                </div>
            </div>
            <div class="hd">
                <ul>
                    <li
                        v-for="(item, index) in fouceList"
                        :key="index"
                        :class="{ on: autoIndex === index }"
                        @mouseenter="(autoIndex = index), stopPlayList()"
                    >
                        <a
                            @click="
                                linkToDt(item.bd1.mvId, findName(item.bd1.type))
                            "
                        >
                            <div class="img">
                                <picture>
                                    <img :src="item.bd2.cover" />
                                </picture>
                            </div>
                            <div class="detail">
                                <div class="title">{{ item.bd1.title }}</div>
                                <div class="info">
                                    {{
                                        item.bd1.type + " | " + item.bd1.country
                                    }}
                                </div>
                                <div class="des">
                                    {{ item.bd2.description }}
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
            :loading="loading"
            :index="recIndex_mv"
            @change="change"
            @linkToDt="linkToDt"
            name2="mv"
            name="mvdt"
        />
        <RecommendSection
            title="新番推荐"
            :rec="recct"
            :loading="loading"
            :index="recIndex_ct"
            @change="change"
            @linkToDt="linkToDt"
            name2="ct"
            name="ctdt"
        />
        <RecommendSection
            title="新剧推荐"
            :rec="rectv"
            :loading="loading"
            :index="recIndex_tv"
            @change="change"
            @linkToDt="linkToDt"
            name2="tv"
            name="tvdt"
        />
    </div>
</template>

<script setup>
// MainComponent.vue
import { ref, onMounted, computed, watch } from "vue";
import { onBeforeRouteUpdate, useRouter } from "vue-router";
import { fetchRecommendData, fetchBdData } from "../utils/api";
import RecommendSection from "../components/Home/RecommendSection.vue";
import { cover } from "../assets/js/cover";

const recct = ref([]);
const recmv = ref([]);
const rectv = ref([]);
const bd1 = ref([]);
const bd2 = ref([]);
const cate = ref([]);
const loading = ref(false);
const imagesLoaded = ref(0);
const pageIndex = ref(1);
const searchKey = ref("");
const autoIndex = ref(0);
let autoPlay = null;
const totalPages = ref(5);
const recIndex_mv = ref({ value: 1 });
const recIndex_tv = ref({ value: 1 });
const recIndex_ct = ref({ value: 1 });
// 清除原数据
const change = (index) => {
    index.value = index.value === totalPages.value ? 1 : index.value + 1;
    console.log(index.value);
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
        const { bd1: bd1Data, bd2: bd2Data } = await fetchBdData(
            3,
            6,
            searchKey.value
        );
        bd1.value = bd1Data;
        bd2.value = bd2Data;
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

const fouceList = computed(() =>
    bd1.value.map((item, index) => ({
        bd1: item,
        bd2: bd2.value.find((b) => b.dtId === item.mvId) || {},
    }))
);
</script>
<!-- <style scoped lang="sass" src="@/assets/css/bootstrap-icons.css"></style>
<style lang="sass" src='@/assets/css/bootstrap.css'></style>
<style lang="sass" src= "@/assets/css/mv.css"></style> -->
<style lang="css" scoped>
/* @import "@/assets/css/bootstrap.css"; */
@import "@/assets/css/mv.css";
@import "@/assets/css/searchResult.css";
</style>
<style scoped>
.on {
    background-color: #e7e7e7;
    border-radius: 5px 5px 5px 5px;
}
</style>