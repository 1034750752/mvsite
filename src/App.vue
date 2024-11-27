<template>
    <RouterView :key="$route.fullPath"></RouterView>
</template>
<script setup>
import { RouterView, useRoute } from "vue-router";
import { watch } from "vue";
const route = useRoute();
// 监听路由变化
watch(
    () => route.name,
    (newname, oldname) => {
        console.log("路由变化:", oldname, "->", newname);
        const routesToRefresh = ["mvdt", "ctdt", "tvdt", "mv", "ct", "tv"];
        // 在这里执行你需要的操作，例如刷新页面
        if (routesToRefresh.includes(oldname)) {
            window.location.reload();
        }
    }
);
</script>
<style lang="css" scoped>
body {
    background-color: #fff;
    color: #333;
    font-family: "Arial", "Helvetica", sans-serif;
    margin: 0;
    min-width: 1200px;
    -webkit-text-size-adjust: 100%;
    overflow-y: scroll;
    overflow: overlay;
}

html,
body {
    height: 100%;
    display: flex;
    flex-direction: column;
}

*,
::after,
::before {
    box-sizing: border-box;
}
</style>
<!-- <style lang="css">
@import "@/assets/css/bootstrap.css";
@import "@/assets/css/bootstrap-icons.css";
</style> -->