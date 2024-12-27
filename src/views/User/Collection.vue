<template>
    <div class="collect_content">
        <div class="search_head">
            <a :class="{ on: type === '' }" @click="type = ''">全部</a>
            <a :class="{ on: type === '电影' }" @click="type = '电影'">电影</a>
            <a :class="{ on: type === '剧集' }" @click="type = '剧集'">剧集</a>
            <a :class="{ on: type === '动漫' }" @click="type = '动漫'">动漫</a>
        </div>
        <!-- 渲染 -->
        <ul class="content-list">
            <li v-for="(item, index) in newList" :key="index">
                <div class="li-img">
                    <a :title="item.title" @click="linkToDt(item, router)">
                        <picture>
                            <el-image
                                :src="item.cover"
                                :alt="item.title"
                                lazy
                            />
                        </picture>
                        <span class="bottom">
                            <span v-if="item.hotNum !== ' '"
                                ><i class="bi bi-fire"></i
                                >{{ item.hotNum }}</span
                            >
                            <span class="biPlay"
                                ><i class="bi bi-play-circle"></i
                                >{{ item.quality }}</span
                            >
                        </span>
                    </a>
                </div>
                <div class="li-bottom">
                    <h3>
                        <a
                            :title="item.title"
                            onmouseover="this.style.color='#d81e06';"
                            onmouseout="this.style.color='black';"
                            @click="linkToDt(item.mvId)"
                            >{{ item.title }}</a
                        >
                        <span>{{ item.rate }}</span>
                    </h3>
                    <div class="tag">
                        {{
                            item.year.trim() +
                            "/" +
                            item.country +
                            "/" +
                            item.cate
                        }}
                    </div>
                    <div v-if="user">
                        <el-popconfirm
                            confirm-button-text="是"
                            cancel-button-text="否"
                            title="确定要删除此收藏?"
                            :hide-icon="true"
                            :hide-after="10"
                            @confirm="confirmEvent(item.mvId)"
                        >
                            <template #reference>
                                <el-button id="favorite">
                                    <el-icon><Delete /></el-icon>
                                    <span>删除收藏</span>
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                    <div v-else>
                        <el-button id="favorite">
                            <el-icon><Delete /></el-icon>
                            <span>删除收藏</span>
                        </el-button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { deleteCollection } from "../../utils/api";
import { getUser, linkToDt } from "../../utils/MvPublic";
import { useUserStore } from "../../store/index";
import { useRouter } from "vue-router";

const router = useRouter();
const type = ref("");
const store = useUserStore();
const list = ref([]); // 定义变量接收数据
const newList = ref([]); // 定义新变量接收变化的数据
const user = computed(() => {
    return getUser();
});

const getCollectList = async () => {
    const CollectList = store.Collection; // 从本地存储获取数据
    // 有数据再操作
    if (CollectList) {
        list.value = CollectList; // 备份数据
        newList.value = list.value; // 新数据
        newList.value.sort((a, b) => b.selectId - a.selectId); // 降序排序
    }
};
const deleteCollectionList = async (userid, mvId) => {
    // 需要登录
    if (user.value) {
        const { result } = await deleteCollection(userid, mvId);
        return result;
    }
    return null;
};
// 确定删除
const confirmEvent = (mvId) => {
    // 需要登录
    if (user.value) {
        deleteCollectionList(user.value.UserId, mvId);
        newList.value = newList.value.filter((item) => item.mvId !== mvId); // 将获取到的数据修改
        store.setCollData(newList.value); // 将本地存储的数据修改
    }
    return null;
};
// 组件加载
onMounted(() => {
    getCollectList();
});
// 监听
watch(type, (newVal) => {
    // 有数据再操作
    if (list.value.length > 0) {
        if (newVal === "") {
            newList.value = list.value;
        } else {
            newList.value = list.value.filter((item) => item.type === newVal);
        }
    }
});
</script>
<style lang="css">
@import "@/assets/css/searchResult.css";
@import "@/assets/css/mv.css";
@import "@/assets/css/collect.css";
</style>