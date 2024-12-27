<template>
    <div v-if="!isSon">
        <!-- 分类 -->
        <div class="list-box">
            <cate_0_2 v-if="route.matched[1].name === 'ct'" />
            <cate_0_1 v-else />
            <cate_1 />
        </div>
        <!-- 排序 -->
        <div class="sort">
            <div>
                排序：
                <select v-model="sortBy" @change="getBdData">
                    <option value="">更新时间</option>
                    <!-- <option value="date">放映时间</option> -->
                    <option value="rate">评分最高</option>
                    <option value="hotNum">热度最高</option>
                </select>
            </div>
        </div>
        <!-- 渲染 -->
        <List :movies="movies.map((item) => item.List1)" />
        <!-- 分页 -->
        <div class="demo-pagination-block">
            <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                next-text="下一页"
                prev-text="上一页"
                background
                layout="prev, pager, next, jumper"
                :total="total"
                :locale="zhCn"
            />
        </div>
    </div>
    <RouterView v-else></RouterView>
</template>
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import cate_0_2 from "../components/List/cate_0_2.vue";
import cate_0_1 from "../components/List/cate_0_1.vue";
import cate_1 from "../components/List/cate_1.vue";
import List from "../components/List/List.vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { fetchListData } from "../utils/api";
import { useRoute } from "vue-router";
import { parseRoute } from "@/utils/parseRoute";

const route = useRoute();
const currentPage = ref(1);
const pageSize = ref(Number(process.env.VUE_APP_PAGE_COUNT));
const total = ref(1000);
const movies = ref([]);
const sortBy = ref("");

const searchKey = ref("");
const cate = ref([]);
const year = ref([]);
const country = ref("");

const isSon = computed(() => {
    return ["mvdt", "ctdt", "tvdt"].includes(route.name);
});
const type = computed(() => {
    if (route.matched[1].name === "mv") {
        return "电影";
    } else if (route.matched[1].name === "ct") {
        return "动漫";
    } else if (route.matched[1].name === "tv") {
        return "剧集";
    }
});

const getBdData = async () => {
    movies.value = [];
    const { List1, List2, totalValue } = await fetchListData(
        cate.value,
        currentPage.value,
        pageSize.value,
        searchKey.value,
        type.value,
        year.value,
        country.value,
        sortBy.value
    );
    total.value = totalValue;
    movies.value = List1.map((item, index) => ({
        List1: item,
        List2: List2[index],
    }));
};

onMounted(() => {
    const routeData = parseRoute(route);
    if (routeData) {
        cate.value = routeData.cate;
        country.value = routeData.country;
        year.value = routeData.year;
    }
    getBdData();
});
watch([currentPage, type, cate, year, country], () => {
    getBdData();
});
</script>

<style lang="css">
@import "@/assets/css/list.css";
</style>
<style scoped>
.demo-pagination-block + .demo-pagination-block {
    margin-top: 10px;
}
.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}
</style>