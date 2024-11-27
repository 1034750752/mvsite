<template>
    <div v-if="!isSon">
        <!-- 分类 -->
        <div class="list-box">
            <cate_0_2 @updataCateValues="updataCateValues" />
            <cate_1
                @updatayearValues="updatayearValues"
                @updatacountryValues="updatacountryValues"
            />
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
        <List
            :movies="movies"
            @loadImage="onImageLoad"
            :loading="loading"
            :imgLoad="imagesLoaded"
        />
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
            />
        </div>
    </div>
    <RouterView v-else></RouterView>
</template>
<script setup>
import { onMounted, ref, watch, computed } from "vue";
import cate_0_2 from "../components/List/cate_0_2.vue";
import cate_1 from "../components/List/cate_1.vue";
import List from "../components/List/List.vue";
import { fetchListData } from "../utils/api";
import { RouterView, useRoute } from "vue-router";
const route = useRoute();
const currentPage = ref(1);
const pageSize = ref(Number(process.env.VUE_APP_PAGE_COUNT));
const total = ref(1000);

const movies = ref([]);

const loading = ref(false);
const imagesLoaded = ref(0);
const sortBy = ref("");

const searchKey = ref("");
const cate = ref([]);
const year = ref([]);
const country = ref("");

const isSon = computed(() => {
    return ["mvdt", "ctdt", "tvdt"].includes(route.name);
});
console.log(route.name);
const type = computed(() => {
    if (route.name === "mv") {
        return "电影";
    } else if (route.name === "ct") {
        return "动漫";
    } else if (route.name === "tv") {
        return "剧集";
    }
});

const updataCateValues = (newCateValues) => {
    cate.value = newCateValues;
    console.log(cate.value);
    if (cate.value[0] === "全部") {
        cate.value = [];
        getBdData();
    }
    getBdData();
};
const updatayearValues = (newyearValues) => {
    year.value = newyearValues;
    console.log(year.value);
    if (year.value[0] === "全部") {
        year.value = [];
        getBdData();
    }
    getBdData();
};
const updatacountryValues = (newcountryValues) => {
    country.value = newcountryValues;
    console.log(country.value);
    if (country.value === "全部") {
        country.value = "";
        getBdData();
    }
    getBdData();
};

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
    // 重置图片加载计数器和加载状态
    imagesLoaded.value = 0;
    loading.value = false;
};

const onImageLoad = () => {
    imagesLoaded.value += 1;
    if (movies.value.length) {
        loading.value = true;
        return;
    }
    if (imagesLoaded.value >= 14 && movies.value.length >= 14) {
        loading.value = true;
    } else {
        loading.value = true;
    }
};
onMounted(() => {
    const spanElement = document.querySelector(".el-pagination__goto");
    if (spanElement) spanElement.textContent = "跳转";
    getBdData();

    if (total.value === 0) {
        loading.value = true;
    }
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