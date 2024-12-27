<template>
    <el-dialog
        class="dialog"
        v-model="localDialogVisible"
        title="请通过验证"
        width="342px"
        @close="handleClose"
    >
        <div>
            <slide-verify
                ref="block"
                :slider-text="text"
                :accuracy="accuracy"
                :imgs="img"
                @again="onAgain"
                @success="onSuccess"
                @fail="onFail"
            ></slide-verify>
            <div>{{ msg }}</div>
        </div>
    </el-dialog>
</template>


<script lang="ts" setup>
import { ref, onBeforeUnmount, watch } from "vue";
import SlideVerify, { type SlideVerifyInstance } from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";

import slideImg1 from "@/assets/verify/city1.jpg";
import slideImg2 from "@/assets/verify/city2.jpg";
import slideImg3 from "@/assets/verify/city3.jpg";
import slideImg4 from "@/assets/verify/city4.jpg";
import slideImg5 from "@/assets/verify/OIP-C.jpg";
import slideImg6 from "@/assets/verify/R-C (1).jpg";
import slideImg7 from "@/assets/verify/R-C (2).jpg";
import slideImg8 from "@/assets/verify/R-C.jpg";

const msg = ref("");
const block = ref<SlideVerifyInstance>();
const img = ref([
    slideImg1,
    slideImg2,
    slideImg3,
    slideImg4,
    slideImg5,
    slideImg6,
    slideImg7,
    slideImg8,
]);
//  定义 props（用于从父组件接收数据）
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true,
    },
});
//  定义 emit 事件（用于向父组件传递消息）
const emit = defineEmits([
    "verify-success",
    "verify-fail",
    "dialog-close",
    "update:dialogVisible",
]);
// 本地数据，用于控制 dialog 可见性
const localDialogVisible = ref(false);
//  监听父组件的 dialogVisible 变化，保持同步
watch(
    () => props.dialogVisible,
    (newVal) => {
        localDialogVisible.value = newVal;
    },
    { immediate: true }
);
// 当关闭对话框时，触发事件，通知父组件更新 dialogVisible
const handleClose = () => {
    emit("update:dialogVisible", false);
    msg.value = "";
};
const onAgain = () => {
    msg.value = "检测到非人为操作的哦！ try again";
    block.value?.refresh();
};

const onSuccess = (times: number) => {
    timerId = setTimeout(() => {
        emit("verify-success", times); // 通知父组件，验证成功
        msg.value = "";
        block.value?.refresh();
    }, 1000);
    msg.value = `验证成功, 耗时${(times / 1000).toFixed(1)}s`;
    // Login()
};
let timerId: number;
const onFail = () => {
    msg.value = "验证不通过";
    emit("verify-fail"); // 通知父组件，验证失败
    timerId = setTimeout(() => {
        block.value?.refresh();
    }, 1000);
    // block.value?.refresh();
};

// 直接暴露给模板的响应式引用和方法
const text = "向右滑动->";
const accuracy = 5;

onBeforeUnmount(() => {
    clearTimeout(timerId);
});
</script>