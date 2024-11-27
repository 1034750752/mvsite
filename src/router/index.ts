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
                component: () => import("@/views/User/Login.vue"),
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
                path: "/s/:searchKey?",
                name: "search",
                component: () => import("@/views/Search.vue"),
            },
            {
                path: "/play/:id_i",
                name: "play",
                component: () => import("@/views/Play.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
