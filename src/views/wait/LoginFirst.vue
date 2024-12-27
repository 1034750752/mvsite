<template>
    <div class="not-found">
        <h1>您尚未登录</h1>
        <p>
            将在 <span>{{ countdown }}</span> 秒后自动跳转登录...
        </p>
        <span style="margin-right: 10px"
            ><router-link to="/user/login">立即前往</router-link></span
        >
        <span>
            <router-link to="/">返回首页</router-link>
        </span>
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
            router.push("/user/login"); // 跳转到首页
        }
    }, 1000); // 每秒更新一次
});
</script>

<style scoped>
.not-found {
    text-align: center;
    width: 300px;
    margin: 100px auto;
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
