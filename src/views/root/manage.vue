<template>
    <div class="mangageContent">
        <el-row class="tac">
            <el-col :span="12">
                <el-menu
                    :default-active="default_active"
                    class="el-menu-vertical-demo"
                    @select="handleSelect"
                    :default-openeds="['manage']"
                >
                    <el-sub-menu index="manage">
                        <template #title>
                            <span style="font-size: 21px">管理面板</span>
                        </template>

                        <el-menu-item index="UserManage">
                            <el-icon><UserFilled /></el-icon>
                            <span>用户管理</span>
                        </el-menu-item>

                        <el-menu-item index="MvManage">
                            <el-icon><VideoCameraFilled /></el-icon>
                            <span>影片管理</span>
                        </el-menu-item>

                        <el-menu-item index="SlideManage">
                            <el-icon><PictureFilled /></el-icon>
                            <span>首页轮播管理</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-col>
        </el-row>
        <main>
            <div>
                <el-link @click="push('/')" target="_blank">首页</el-link>
            </div>
            <RouterView></RouterView>
        </main>
    </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, computed } from "vue";

const router = useRouter();
const route = useRoute();
// 默认路由
const default_active = computed(() => {
    if (route.matched[1]) {
        return route.matched[1].name;
    }
    return "UserManage";
});

const handleSelect = (key: string) => {
    // 点击跳转
    router.push({
        name: key,
    });
};
const push = (path: string) => {
    // 点击跳转
    router.push({
        path: path,
    });
};
onMounted(() => {
    // 默认跳转
    router.push({
        name: default_active.value,
    });
});
</script>
<style scoped>
@import "@/assets/css/manage.css";
</style>
