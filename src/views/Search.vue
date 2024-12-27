<template>
    <div class="breadcrumbs">
        为您找到{{ searchTotal }}条与 {{ searchKey }} 相关的资源
    </div>
    <div class="search_head">
        <a :class="{ on: type === '' }" @click="type = ''"
            >全部{{ total_show }}</a
        >
        <a :class="{ on: type === '电影' }" @click="type = '电影'"
            >电影{{ mvTotal }}</a
        >
        <a :class="{ on: type === '剧集' }" @click="type = '剧集'"
            >剧集{{ tvTotal }}</a
        >
        <a :class="{ on: type === '动漫' }" @click="type = '动漫'"
            >动漫{{ ctTotal }}</a
        >
        <div class="right">
            <a
                :class="{ on: searchType === '模糊' }"
                @click="searchType = '模糊'"
                >模糊</a
            >
            <a
                :class="{ on: searchType === '精确' }"
                @click="searchType = '精确'"
                >精确</a
            >
        </div>
    </div>
    <div class="sr_lists">
        <!-- 循环 -->
        <div class="v5d" v-for="(item, value) in searchData" :key="value">
            <div class="img">
                <a :href="linkToDt(item.List1.type, item.List1.dtId)">
                    <picture>
                        <el-image
                            :src="item.List1.cover"
                            :alt="item.List1.title"
                            style="width: 140px; height: 210px"
                            lazy
                        >
                            <template #placeholder>
                                <div
                                    style="
                                        height: 100%;
                                        background-color: rgb(
                                            136 136 136 / 20%
                                        );
                                    "
                                ></div>
                            </template>
                        </el-image>
                    </picture>
                </a>
            </div>
            <div class="text">
                <b>
                    <a
                        :href="linkToDt(item.List1.type, item.List1.dtId)"
                        class="d16"
                        v-html="
                            findKey(item.List1.title) +
                            ' (' +
                            item.List1.year +
                            ')'
                        "
                    >
                    </a>
                </b>
                <p>
                    {{ item.List2.type }} / {{ item.List2.quality }} /
                    {{ item.List2.country.split("/")[0] }} /
                    {{
                        item.List2.cate
                            .split("/")
                            .map((item) => item)
                            .join(" / ")
                    }}
                </p>
                <p v-if="item.List1.releaseTime">
                    上映：{{ item.List1.releaseTime }}
                </p>
                <p
                    v-if="item.List1.director"
                    v-html="formatData('导演：', item.List1.director)"
                ></p>
                <p
                    v-if="item.List1.scriptwriter"
                    v-html="formatData('编剧：', item.List1.scriptwriter)"
                ></p>
                <p
                    v-if="item.List1.actor"
                    v-html="formatData('主演：', item.List1.actor)"
                ></p>
            </div>
        </div>
    </div>

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
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { fetchSearchData } from "../utils/api";
import { changeTit } from "../utils/changeTit";
const route = useRoute();
const currentPage = ref(1);
const type = ref("");
const pageSize = ref(25);
const searchType = ref("模糊");
const total = ref(0);
const total_show = ref(0);
const mvTotal = ref(0);
const ctTotal = ref(0);
const tvTotal = ref(0);
const searchData = ref([]);
const searchKey = route.params.searchKey;

const searchTotal = computed(() => {
    if (type.value === "") {
        return total.value;
    } else if (type.value === "电影") {
        return mvTotal.value;
    } else if (type.value === "动漫") {
        return ctTotal.value;
    } else {
        return tvTotal.value;
    }
});
const linkToDt = (type, id) => {
    let ty = "";
    if (type === "电影") {
        ty = "mv";
    } else if (type === "动漫") {
        ty = "ct";
    } else {
        ty = "tv";
    }
    const link = `/${ty}/${id}`;
    return link;
};
// 高亮显示
const findKey = (item) => {
    if (searchType.value === "模糊") {
        // Step 1: 剥离掉已经包含 <em> 标签的部分
        const cleanItem = item.replace(/<em[^>]*>(.*?)<\/em>/g, "$1"); // 删除已有的 <em> 标签

        // Step 2: 对剩下的部分进行字符替换
        const highlighted = cleanItem
            .split("")
            .map((char) =>
                searchKey.toLowerCase().includes(char.toLowerCase())
                    ? `<em>${char}</em>`
                    : char
            )
            .join("");

        // Step 3: 拼接处理后的部分和原始 <em> 标签部分
        return highlighted;
    }
    const str = item.replace(
        new RegExp(searchKey, "gi"),
        (match) => `<em>${match}</em>`
    );
    return str;
};
const formatData = (title, value) => {
    const str1 = value
        .split("/")
        .map((item) => findKey(item))
        .join(" / ");
    const str = title + str1;
    return str;
};
const getSearchData = async () => {
    searchData.value = [];
    const { List1, List2, totalValue } = await fetchSearchData(
        currentPage.value,
        pageSize.value,
        searchKey,
        type.value,
        searchType.value
    );
    total.value = totalValue;
    searchData.value = List1.map((item, index) => ({
        List1: item,
        List2: List2[index],
    }));
};

const getTotal = async () => {
    const { totalValue } = await fetchSearchData(
        currentPage.value,
        pageSize.value,
        searchKey,
        "",
        searchType.value
    );
    total_show.value = totalValue > 99 ? "99+" : totalValue;
};
const getmvTotal = async () => {
    const { totalValue } = await fetchSearchData(
        currentPage.value,
        pageSize.value,
        searchKey,
        "电影",
        searchType.value
    );
    mvTotal.value = totalValue > 99 ? "99+" : totalValue;
};
const getCtTotal = async () => {
    const { totalValue } = await fetchSearchData(
        currentPage.value,
        pageSize.value,
        searchKey,
        "动漫",
        searchType.value
    );
    ctTotal.value = totalValue > 99 ? "99+" : totalValue;
};
const getTvTotal = async () => {
    const { totalValue } = await fetchSearchData(
        currentPage.value,
        pageSize.value,
        searchKey,
        "剧集",
        searchType.value
    );
    tvTotal.value = totalValue > 99 ? "99+" : totalValue;
};
onMounted(() => {
    const searchTitle = ref(
        searchKey + "-" + "搜索结果" + "-" + process.env.VUE_APP_NAME
    );
    changeTit(searchTitle);
    if (searchKey !== "") {
        getSearchData();
        getmvTotal();
        getTotal();
        getCtTotal();
        getTvTotal();
    }

    const spanElement = document.querySelector(".el-pagination__goto");
    if (spanElement) spanElement.textContent = "跳转";
});
watch([currentPage, type, searchType], () => {
    getSearchData();
    getmvTotal();
    getTotal();
    getCtTotal();
    getTvTotal();
});
</script>

<style lang="css">
@import "@/assets/css/searchResult.css";
</style>
<style>
.v5d .text em {
    font-style: normal;
    color: #ff0000f0;
}
</style>