<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { fetchCollectList } from "../utils/api";
import { getUser, triggerRefresh } from "../utils/MvPublic";
import { useUserStore } from "../store/index";
import { jwtDecode } from "jwt-decode";
import axios from "../store/axios";
import { useCookies } from "vue-cookies";

const searchKey = ref();
const route = useRoute();
const store = useUserStore();
const show_tabAccount = ref(false);
const url = ref("/s/");
const token = ref();
const isActive = (path) => {
    return route.path.startsWith(path);
};

const img = computed(() => {
    if (user.value) return user.value.pic;
    else return "https://s.tutu.pm/tx/0.png";
});

const user = computed(() => {
    return getUser();
});

const isHome = (path) => {
    return route.path === path;
};
const searchClick = (event) => {
    if (!searchKey.value) {
        event.preventDefault();
        return;
    }
    // 搜索框过滤
    const newSearchKey = searchKey.value.trim().replace(/[<>`'"\\]/g, "");
    window.location.href = url.value + newSearchKey;
};
// 切换菜单显示状态
const toggleTabAccount = () => {
    show_tabAccount.value = !show_tabAccount.value;
};
// 点击外部关闭菜单
const handleClickOutside = (event) => {
    const u5d = document.querySelector(".u5d");
    const tx = document.querySelector(".tx");
    if (
        show_tabAccount.value && // 菜单显示时才判断
        u5d &&
        !u5d.contains(event.target) &&
        tx &&
        !tx.contains(event.target)
    ) {
        show_tabAccount.value = false; // 关闭菜单
    }
};
// 退出登录
const logout = async () => {
    await axios.post("/logout");
    user.value = null;
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
    show_tabAccount.value = false; // 关闭菜单
    window.location.reload();
    triggerRefresh();
};
// 将用户收藏存入本地存储
const getCollectList = async () => {
    // 需要登录
    if (user.value) {
        const userCollect = localStorage.getItem("userCollect");
        // 获取不到本地存储就添加
        if (!userCollect) {
            const { CollectList } = await fetchCollectList(user.value.UserId);
            store.setCollData(CollectList);
        }
        return 0;
    }
    // 没有用户就移除收藏的本地存储
    if (localStorage.getItem("userCollect"))
        localStorage.removeItem("userCollect");
};
// const getCookie = (name)=>{

// }
// onMounted  (()=>{
//   console.log('cookie:',document.cookie)
// // })
// console.log('token:',token.value)
// 在组件挂载时添加事件监听器，销毁时移除监听器
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
    getCollectList(); // 将用户收藏存入本地存储
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
    <div id="myHeader">
        <nav class="nav">
            <RouterLink
                class="nav-link"
                :class="{ active: isHome('/') }"
                aria-current="page"
                :to="{
                    name: 'home',
                }"
                >首页</RouterLink
            >
            <RouterLink
                class="nav-link"
                :class="{ active: isActive('/mv') }"
                :to="{
                    name: 'mv',
                }"
                >电影</RouterLink
            >
            <RouterLink
                class="nav-link"
                :class="{ active: isActive('/tv') }"
                :to="{
                    name: 'tv',
                }"
                >剧集</RouterLink
            >
            <RouterLink
                class="nav-link"
                :class="{ active: isActive('/ct') }"
                :to="{
                    name: 'ct',
                }"
                >动漫</RouterLink
            >
            <RouterLink
                v-if="user && (user.level === 0 || user.level === -1)"
                class="nav-link"
                :to="{
                    name: 'manage',
                }"
                >管理面板</RouterLink
            >
            <div>
                <form class="d-flex" role="search" @submit.prevent>
                    <input
                        class="form-control me-2"
                        type="search"
                        placeholder="输入关键词"
                        aria-label="Search"
                        v-model="searchKey"
                        @keyup.enter="searchClick"
                    />
                    <button
                        class="btn btn-outline-success"
                        type="submit"
                        @click="searchClick"
                    >
                        搜索
                    </button>
                </form>
            </div>
            <div class="user_menu">
                <!-- <span><a href="">收藏</a></span> -->
                <!-- <span id="his"
                    ><a href="">观看历史</a>
                    <ul id="historys"></ul>
                </span> -->
            </div>
            <div class="tx" @click.stop="toggleTabAccount">
                <img :src="img" />
            </div>
            <div class="u5d" v-show="show_tabAccount" v-if="user">
                <div class="uj4">
                    <div class="utx"><img :src="img" /></div>
                    <div class="un0">
                        <b>{{ user.nickname }}</b
                        ><br />{{ user.uname }}
                    </div>
                </div>
                <ul class="sub">
                    <li><a href="/user/collect">我的收藏</a></li>
                    <li><a href="/user/account">账户设置</a></li>
                    <li><a href="#" @click="logout">退出登录</a></li>
                </ul>
            </div>
            <div class="u5d" v-show="show_tabAccount" v-else>
                <div class="uj4">
                    <div class="utx">
                        <img src="https://s.tutu.pm/tx/0.png" />
                    </div>
                    <div class="un0"><b>nickname</b><br />uname</div>
                </div>
                <ul class="sub">
                    <li><a href="/user/login">点击登录</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<style lang="css" scoped>
@import "@/assets/css/header.css";
</style>
<style scoped>
.active {
    font-weight: bold;
    color: var(--bs-link-hover-color);
}
.btn {
    width: 80px;
}
.d-flex {
    margin-left: 400px;
}
.d-flex input:focus {
    box-shadow: none;
}
.btn {
    background-color: #fff;
}
.nav {
    --bs-nav-link-font-weight: 16px;
    --bs-nav-link-color: var(--bs-secondary-color);
    --bs-nav-link-hover-color: var(--bs-link-color);
    --bs-nav-link-disabled-color: var(--bs-secondary-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 1200px;
    height: 60px;
    margin: 0 auto;
}
</style>