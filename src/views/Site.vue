<script setup>
import myHeader from "./MyHeader.vue";
</script>

<template>
    <myHeader />
    <main>
        <RouterView :key="$route.fullPath"></RouterView>
    </main>
</template>


<style scoped>
main {
    width: 1200px;
    margin: 0 auto;
    flex: 1 0 auto;
    padding-top: 110px;
}
</style>


<!-- <style lang="css">
@import "@/assets/css/bootstrap.css";
@import "@/assets/css/bootstrap-icons.css";
</style> -->