import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        name: "user",
        path: "/user",
        component: () => import("@/views/User/User.vue"),
        children: [
            {
                name: "login",
                path: "login",
                meta: { title: "登录" },
                component: () => import("@/views/User/Login.vue"),
            },
            {
                name: "regist",
                path: "regist",
                meta: { title: "注册" },
                component: () => import("@/views/User/regist.vue"),
            },
            {
                path: "", // 捕获 `/user`，当不匹配任何子路径时触发
                name: "UserNotFound",
                meta: { title: "404 - 页面未找到" },
                component: () => import("@/views/wait/NotFound.vue"),
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*", // 通配符路径
        name: "NotFound",
        meta: { title: "404 - 页面未找到" },
        component: () => import("@/views/wait/NotFound.vue"), // 懒加载 NotFound 组件
    },
    {
        path: "/:pathMatch(.*)*",
        name: "Loading",
        meta: { title: "跳转提示" },
        component: () => import("@/views/wait/Loading.vue"), // 懒加载 Loading 组件
    },
    {
        path: "/:pathMatch(.*)*",
        name: "LoginFirst",
        meta: { title: "跳转提示" },
        component: () => import("@/views/wait/LoginFirst.vue"), // 懒加载 Loading 组件
    },

    {
        name: "manage",
        path: "/manage",
        meta: { title: "管理面板" },
        component: () => import("@/views/root/manage.vue"),
        children: [
            {
                path: "user",
                name: "UserManage",
                meta: { title: "用户管理" },
                component: () => import("@/views/root/UserManage.vue"),
            },
            {
                path: "mv",
                name: "MvManage",
                meta: { title: "影片管理" },
                component: () => import("@/views/root/mvManage.vue"),
            },
            {
                path: "mvadd",
                name: "mvManageAdd",
                meta: { title: "影片添加" },
                component: () => import("@/views/root/mvAdd.vue"),
            },
            {
                path: "mvedit_:mvId",
                name: "mvManageEdit",
                meta: { title: "影片编辑" },
                component: () => import("@/views/root/mvEdit.vue"),
            },
            {
                path: "slide",
                name: "SlideManage",
                meta: { title: "首页轮播管理" },
                component: () => import("@/views/root/slideManage.vue"),
            },
        ],
    },

    {
        name: "Site",
        path: "/",
        component: () => import("@/views/Site.vue"),
        children: [
            {
                path: "/",
                name: "home",
                component: () => import("@/views/Home.vue"),
            },
            {
                path: "/mv",
                name: "mv",
                meta: { title: "电影筛选" },
                component: () => import("@/views/MV.vue"),
                children: [
                    {
                        path: ":cate?-:year?-:local?",
                        name: "mvCate",
                        component: () => import("@/components/List/List.vue"),
                    },
                    {
                        path: ":id(\\d+)",
                        name: "mvdt",
                        component: () => import("@/views/MVdt.vue"),
                    },
                ],
            },
            {
                path: "/tv",
                name: "tv",
                meta: { title: "剧集筛选" },
                component: () => import("@/views/MV.vue"),
                children: [
                    {
                        path: ":cate?-:year?-:local?",
                        name: "tvCate",
                        component: () => import("@/components/List/List.vue"),
                    },
                    {
                        path: ":id(\\d+)",
                        name: "tvdt",
                        component: () => import("@/views/MVdt.vue"),
                    },
                ],
            },

            {
                path: "/ct",
                name: "ct",
                meta: { title: "动漫筛选" },
                component: () => import("@/views/MV.vue"),
                children: [
                    {
                        path: ":cate?-:year?-:local?",
                        name: "ctCate",
                        component: () => import("@/components/List/List.vue"),
                    },
                    {
                        path: ":id(\\d+)",
                        name: "ctdt",
                        component: () => import("@/views/MVdt.vue"),
                    },
                ],
            },
            {
                name: "collect",
                path: "/user/collect",
                meta: { title: "用户收藏" },
                component: () => import("@/views/User/Collection.vue"),
            },
            {
                name: "userUpdate",
                path: "/user/account",
                meta: { title: "账号管理" },
                component: () => import("@/views/User/updateUser.vue"),
            },
            {
                path: "/s/:searchKey?",
                name: "search",
                component: () => import("@/views/Search.vue"),
            },
            {
                path: "/play/:id_i",
                name: "play",
                props: true,
                component: () => import("@/views/Play.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});
// 全局路由守卫，动态设置标题,防止条件路由访问
router.beforeEach((to, from, next) => {
    interface User {
        level: number;
    }
    let user: User | null = JSON.parse(localStorage.getItem("token") || "null");

    const isLoggedIn = user; // 假设 userStore 有 user 字段表示登录状态

    // 需要登录的路由
    const requiresAuth = ["/user/account", "/manage", "/user/collect"];
    // 不需要登录的路由
    const unRequiresAuth = ["login", "regist"];
    if (unRequiresAuth.some((name) => to.name === name) && isLoggedIn) {
        next({ name: "Loading" });
    }
    // 如果目标路由是 /manage，验证 user.level 是否等于 0
    if (to.path === "/manage") {
        if (!user || user.level !== 0) {
            return next({ name: "NotFound" }); // 用户没有权限，跳转到 404 页面
        }
    }
    if (requiresAuth.some((path) => to.path.startsWith(path)) && !isLoggedIn) {
        // 检查目标路由是否需要登录
        // 如果未登录，跳转到登录页
        next({ name: "LoginFirst" });
    } else {
        // 设置标题
        document.title = to.meta.title
            ? to.meta.title + " | " + process.env.VUE_APP_NAME
            : process.env.VUE_APP_NAME;

        next(); // 允许进入目标路由
    }
});
export default router;
