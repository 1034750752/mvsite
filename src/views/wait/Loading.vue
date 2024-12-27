<template>
    <div class="not-found">
        <h1>已登录</h1>
        <p>
            将在 <span>{{ countdown }}</span> 秒后返回首页...
        </p>
        <router-link to="/">返回首页</router-link>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const countdown = ref(5); // 倒计时初始值

// 倒计时逻辑
onMounted(() => {
    const interval = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
        } else {
            clearInterval(interval); // 清除定时器
            router.push("/"); // 跳转到首页
        }
    }, 1000); // 每秒更新一次
});
</script>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 20px;
    width: 300px;
}
h1 {
    font-size: 3em;
    color: #000000;
}
p {
    font-size: 20px;
    color: #555;
}
</style>
