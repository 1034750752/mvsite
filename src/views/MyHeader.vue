<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRoute, onBeforeRouteUpdate } from "vue-router";
import { jwtDecode } from "jwt-decode";
import axios from "../store/axios";
import { useCookies } from "vue-cookies";

const searchKey = ref();
const route = useRoute();
const show_tabAccount = ref(false);
const url = ref("/s/");
const token = ref();
const isActive = (path) => {
    return route.path.startsWith(path);
};
console.log(JSON.parse(localStorage.getItem("token")));

const img = computed(() => {
    if (user.value) return user.value.pic;
    else return "https://s.tutu.pm/tx/0.png";
});
const user = computed(() => {
    if (localStorage.getItem("token"))
        return JSON.parse(localStorage.getItem("token"));
    else return null;
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
// const getCookie = (name)=>{

// }
// onMounted  (()=>{
//   console.log('cookie:',document.cookie)
// // })
// console.log('token:',token.value)
const logout = async () => {
    await axios.post("/logout");
    user.value = null;
    window.location.href = "/";
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
};
</script>

<template>
    <header>
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
                <span><a href="">收藏</a></span>
                <span id="his"
                    ><a href="">观看历史</a>
                    <ul id="historys"></ul>
                </span>
            </div>
            <div
                class="tx"
                @click="
                    show_tabAccount = show_tabAccount === false ? true : false
                "
            >
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
                    <li><a href="/user/favorite">我的收藏</a></li>
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
    </header>
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