<template>
    <el-upload
        class="avatar-uploader"
        :action="action"
        name="file"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
        <img v-if="imageUrl" :src="imageUrl" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const action = process.env.VUE_APP_UPLOAD_URL; // 请求路由
// const defImg = "11";
const props = defineProps({
    imageUrl: {
        type: String,
    },
});
const emit = defineEmits(["updateUrl"]); // 定义自定义事件
// 上传成功回调
const handleAvatarSuccess = (response) => {
    if (response && response.url) {
        emit("updateUrl", response.url); // 通知父组件更新图片 URL
    }
};
// 上传前的回调
const beforeAvatarUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2; // 2MB 限制
    if (!isJpgOrPng) {
        ElMessage.error("上传的图片只能是 JPG/PNG 格式! ");
        return false;
    }
    if (!isLt2M) {
        ElMessage.error("图片大小不能超过 2MB!");
        return false;
    }
    return true;
};
</script>
<style scoped>
.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.el-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 300px;
    text-align: center;
}
.avatar-uploader {
    border: 1px dashed var(--el-border-color);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}
</style>