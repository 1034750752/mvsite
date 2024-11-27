<template>
    <div class="main-left">
        <div class="main-left-1">
            <div
                class="wrap row main-meta"
                v-for="(item, value) in mvdt"
                :key="value"
            >
                <div class="img">
                    <picture width="100%">
                        <img :src="item.cover" :alt="item.title" />
                    </picture>
                    <div class="favorite">
                        <button id="favorite">添加我的收藏</button>
                    </div>
                </div>
                <div class="main-ui-meta">
                    <h1>
                        <div>{{ item.title }}</div>
                        <span class="year">({{ item.year }})</span>
                    </h1>
                    <div class="otherbox" v-if="item.type === '电影'">
                        当前为 {{ quality }} 资源，最后更新于<em>3天前</em>
                    </div>
                    <div class="otherbox" v-else>
                        更新至{{ qualityNum }}集 / {{ mvStatue }}，最后更新于
                        <em>3天前</em>
                    </div>
                    <tag
                        spanValue="导演："
                        :item="item.director"
                        v-model:zkFlag="zkFlag_director"
                    />
                    <tag
                        spanValue="编剧："
                        :item="item.scriptwriter"
                        v-model:zkFlag="zkFlag_scriptwriter"
                    />
                    <tag
                        spanValue="主演："
                        :item="item.actor"
                        v-model:zkFlag="zkFlag_actor"
                    />

                    <div v-if="item.cate">
                        <span v-if="item.cate">类型：</span>
                        <i
                            v-for="(cate, index) in item.cate.split('/')"
                            :key="index"
                        >
                            <RouterLink
                                :to="{
                                    name: typeName + 'Cate',
                                    params: {
                                        cate: item.cate.split('/')[index],
                                    },
                                }"
                                >{{ cate }}</RouterLink
                            >
                            <span
                                v-if="index < item.cate.split('/').length - 1"
                            >
                                /
                            </span>
                        </i>
                    </div>
                    <div v-if="item.country">
                        <span>地区：</span>
                        <i
                            v-for="(country, index) in item.country.split('/')"
                            :key="index"
                        >
                            <RouterLink
                                :to="{
                                    name: typeName + 'Cate',
                                    params: {
                                        local: item.country.split('/')[index],
                                    },
                                }"
                                >{{ country }}</RouterLink
                            >
                            <span
                                v-if="
                                    index < item.country.split('/').length - 1
                                "
                            >
                                /
                            </span>
                        </i>
                    </div>
                    <div v-if="item.language">
                        <span>语言：</span>
                        <i
                            v-for="(language, index) in item.language.split(
                                '/'
                            )"
                            :key="index"
                        >
                            {{ language }}
                            <span
                                v-if="
                                    index < item.language.split('/').length - 1
                                "
                            >
                                /
                            </span>
                        </i>
                    </div>
                    <div v-if="item.releaseTime">
                        <span>上映：</span>{{ item.releaseTime }}
                    </div>
                    <div v-if="item.length">
                        <span>片长：</span>{{ item.length }}
                    </div>
                    <div>
                        <span>评分：</span>
                        <i>{{ item.rate }}</i>
                    </div>
                </div>
            </div>
            <div class="wrap row" v-for="(item, index) in mvdt" :key="index">
                <div v-if="item.description">
                    <h2>电影简介</h2>
                    <div
                        class="movie-introduce"
                        v-if="item.description.length < 140"
                    >
                        <p class="zkjj_a" style="font-size: 14px">
                            {{ item.description }}
                        </p>
                    </div>

                    <div class="movie-introduce" v-else>
                        <p
                            class="zkjj_a"
                            v-show="!zkFlag_description"
                            style="font-size: 14px"
                        >
                            {{ item.description.slice(0, 140) }}
                            <span
                                class="zk_jj"
                                @click="zkFlag_description = true"
                                >[展开全部]</span
                            >
                        </p>
                        <p
                            class="sqjj_a"
                            v-show="zkFlag_description"
                            style="font-size: 14px"
                        >
                            {{ item.description
                            }}<span
                                class="sq_jj"
                                @click="zkFlag_description = false"
                                >[收起部分]</span
                            >
                        </p>
                    </div>
                </div>
            </div>
            <div id="url">
                <div>
                    <ul class="all-tabs">
                        <li
                            :class="{ on: tab_state === 0 }"
                            @click="tab_state = 0"
                        >
                            资源下载
                        </li>
                        <li
                            :class="{ on: tab_state === 1 }"
                            @click="tab_state = 1"
                        >
                            在线播放
                        </li>
                    </ul>
                </div>

                <div v-show="tab_state === 1">
                    <div class="sBox wrap row" id="play">
                        <h2>
                            在线播放
                            <div class="hd right py-tabs"></div>
                        </h2>
                        <div class="player-all">
                            <ul class="player-all-ul">
                                <li>
                                    <ul class="player ckp">
                                        <li v-if="route.path.includes('mv')">
                                            <a :href="getPlay(id, 1)">HD中字</a>
                                        </li>
                                        <li
                                            v-for="(i, index) in qualityNum"
                                            :key="index"
                                            v-else
                                        >
                                            <a :href="getPlay(id, i)"
                                                >第{{ i }}集</a
                                            >
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 资源下载 -->
            <div v-show="tab_state === 0">
                <div class="wrap row" id="pan" v-if="false">
                    <h2></h2>
                    <div class="pt-list">
                        <ul>
                            <li class="on">全部<i class="badge">0</i></li>
                            <li>百度网盘<i class="badge">0</i></li>
                            <li>夸克网盘<i class="badge">0</i></li>
                            <li>迅雷网盘<i class="badge">0</i></li>
                            <li>阿里网盘<i class="badge">0</i></li>
                        </ul>
                    </div>
                    <div>
                        <div style="font-size: 14px">百度网盘</div>
                        <ul>
                            <li
                                v-for="(i, index) in 1"
                                :key="index"
                                style="line-height: 28px; font-size: 13px"
                            >
                                <a href="" target="_blank">value</a>
                                <i>
                                    提取码：<i style="color: #337ab7">key</i
                                    ><i>name</i
                                    ><i style="color: #717171">lateTime</i>
                                </i>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div style="font-size: 14px">夸克网盘</div>
                        <ul>
                            <li
                                v-for="(i, index) in 1"
                                :key="index"
                                style="line-height: 28px; font-size: 13px"
                            >
                                <a href="" target="_blank">value</a>
                                <i>
                                    提取码：<i style="color: #337ab7">key</i
                                    ><i>name</i
                                    ><i style="color: #717171">lateTime</i>
                                </i>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div style="font-size: 14px">迅雷网盘</div>
                        <ul>
                            <li
                                v-for="(i, index) in 1"
                                :key="index"
                                style="line-height: 28px; font-size: 13px"
                            >
                                <a href="" target="_blank">value</a>
                                <i>
                                    提取码：<i style="color: #337ab7">key</i
                                    ><i>name</i
                                    ><i style="color: #717171">lateTime</i>
                                </i>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div style="font-size: 14px">阿里网盘</div>
                        <ul>
                            <li
                                v-for="(i, index) in 1"
                                :key="index"
                                style="line-height: 28px; font-size: 13px"
                            >
                                <a href="" target="_blank">value</a>
                                <i>
                                    提取码：<i style="color: #337ab7">key</i
                                    ><i>name</i
                                    ><i style="color: #717171">lateTime</i>
                                </i>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-else class="pan_nothing">暂无资源......</div>
            </div>

            <!-- 推荐 -->
            <div class="wrap row" v-for="(i, index) in mvdt" :key="index">
                <h2>{{ i.type }}推荐</h2>
                <ul class="content-list2">
                    <!-- 循环 -->
                    <li v-for="(item, index) in typeCom" :key="index">
                        <div>
                            <div class="li-img">
                                <a
                                    class="pic_link"
                                    :title="item.title"
                                    @click="linkToDt(item.mvId)"
                                >
                                    <picture>
                                        <img
                                            :src="item.cover"
                                            :alt="item.title"
                                        />
                                    </picture>
                                </a>
                            </div>
                            <div class="li-bottom">
                                <h3>
                                    <a
                                        :title="item.title"
                                        @click="linkToDt(item.mvId)"
                                        style="color: black"
                                        onmouseover="this.style.color='#d81e06';"
                                        onmouseout="this.style.color='black';"
                                        >{{ item.title }}</a
                                    >
                                </h3>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- 热门 -->
    <div class="main-right">
        <div class="wrap row">
            <h2>热门{{ type }}</h2>
            <ul class="whits">
                <!-- 循环 -->
                <li v-for="(item, index) in hotmv" :key="index">
                    <div class="wimg">
                        <a
                            :title="item.List1.title"
                            @click="linkToDt(item.List1.mvId)"
                        >
                            <picture>
                                <img
                                    :src="item.List1.cover"
                                    :alt="item.List1.title"
                                />
                            </picture>
                        </a>
                    </div>
                    <div class="wlist">
                        <h3>
                            <a
                                :title="item.List1.title"
                                @click="linkToDt(item.List1.mvId)"
                                style="color: #337ab7"
                                onmouseover="this.style.color='#d81e06';"
                                onmouseout="this.style.color='#337ab7';"
                                >{{ item.List1.title }}</a
                            >
                        </h3>
                        <p>类型：{{ item.List2.cate }}</p>
                        <p>主演：{{ item.List2.actor }}</p>
                        <p>评分：{{ item.List2.rate }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { fetchListData } from "../utils/api";
import axios from "../store/axios";
import tag from "@/components/MVdt/tag.vue";
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const mvdt = ref();
const quality = ref(0);
const typeName = route.matched[1].name;
const dtReMvId = ref(0);
const typeCom = ref([]);
const cate = ref([]);
const type = ref();
const country = ref("");
const hotmv = ref([]);
const qualityNum = ref();
const mvStatue = ref();
const pages = ref(1);
const tab_state = ref(1);
//定义展开的flag
const zkFlag_actor = ref(true);
// const zkFlag_cate = ref(true)
const zkFlag_director = ref(true);
const zkFlag_scriptwriter = ref(true);
const zkFlag_description = ref(false);

const getPlay = (id, i) => {
    const url = `/play/${id}_${i}`;
    return url;
};
const getpages = (total, pagesize) => {
    pages.value = Math.ceil(total / pagesize);
    return pages.value;
};
const getRandom = (start, end) => {
    const num = Math.floor(Math.random() * end) + start;
    return num;
};
const fetchData = async () => {
    try {
        const response = await axios.get("/mv/mvdt", {
            params: { mvId: id },
        });
        mvdt.value = response.data.data.list;
        const response2 = await axios.get("/mv/mvdt", {
            params: { mvId: id, search: 1 },
        });
        quality.value = response2.data.data.list[0].quality;
        qualityNum.value = parseInt(quality.value.match(/\d+/g));
        mvStatue.value = quality.value.includes("更至") ? "连载中" : "已完结";

        cate.value = mvdt.value[0].cate.split("/");

        country.value = mvdt.value[0].country.split("/")[0];
        const getTypecomTotal = await axios.get("mv", {
            params: {
                cate: cate.value,
                type: type.value,
                country: country.value,
                pageSize: 6,
                cateComment: 1,
            },
        });
        const TypeComtotal = getTypecomTotal.data.data.total;
        async function fetchTypeCom() {
            const getTypecom = await axios.get("mv", {
                params: {
                    mvId: dtReMvId.value,
                    cate: cate.value,
                    type: type.value,
                    country: country.value,
                    pageSize: 6,
                    cateComment: 1,
                    pageIndex: getRandom(1, getpages(TypeComtotal, 6) - 1),
                },
            });
            typeCom.value = getTypecom.data.data.list;

            const SameId = typeCom.value.some(
                (Element) => Number(Element.mvId) === Number(id)
            );
            if (SameId) {
                fetchTypeCom();
            }
        }
        fetchTypeCom();
    } catch (err) {
        console.error("Error fetching data:", err);
    }
};

const getHotdata = async () => {
    hotmv.value = [];
    const { List1, List2 } = await fetchListData(
        [],
        1,
        10,
        "",
        type.value,
        "",
        country.value,
        "hotNum"
    );
    hotmv.value = List1.map((item, index) => ({
        List1: item,
        List2: List2[index],
    }));
};

const name = ref("");
if (route.path.includes("mv")) {
    name.value = "mvdt";
    type.value = "电影";
} else if (route.path.includes("ct")) {
    name.value = "ctdt";
    type.value = "动漫";
} else {
    name.value = "tvdt";
    type.value = "剧集";
}
const linkToDt = (id) => {
    const routeData = router.resolve({
        name: name.value,
        params: { id },
    });
    window.open(routeData.href, "_blank");
};
onMounted(() => {
    fetchData();
    getHotdata();
});
</script>
<style lang="css" scoped>
@import "@/assets/css/about.css";
</style>
<style scoped>
#favorite {
    border: 0;
}

.main-meta {
    display: flex;
    flex-wrap: nowrap;
}
ol,
ul,
dl {
    margin-top: 0;
    margin-bottom: 1rem;
}
.main-left-1 #url {
    margin-top: 20px;
}
.main-left-1 .all-tabs {
    margin-bottom: -3px;
}
.main-left-1 #play {
    display: inline-block;
    width: auto;
}
</style>
