<template>
    <div class="updateContent">
        <div class="title">
            <h3>账号管理</h3>
        </div>
        <div class="update_body">
            <div class="form_content" v-if="flag_page">
                <myinput
                    name="用户名"
                    v-model="user.uname"
                    :diable_flag="true"
                />
                <myinput
                    name="昵称"
                    v-model="user.nickname"
                    :diable_flag="diable_flag"
                />
                <myinput
                    name="邮箱"
                    v-model="user.email"
                    :diable_flag="diable_flag"
                />

                <div style="margin-top: 30px">
                    <el-button color="#05a7e1" @click="toggle_page"
                        >修改密码</el-button
                    >
                    <el-button color="#05a7e1" @click="updateClick">{{
                        btn_text
                    }}</el-button>
                </div>
            </div>
            <div class="form_content" v-else>
                <myinput
                    name="原密码"
                    v-model="opwd"
                    :diable_flag="false"
                    :show_password="true"
                    placeholder="请输入原密码"
                    tips="密码错误"
                    :showTips="showOldPwd"
                />
                <myinput
                    name="新密码"
                    v-model="npwd"
                    :diable_flag="false"
                    :show_password="true"
                    placeholder="请输入新密码"
                    tips="6-20位字符"
                    :showTips="showNewPwd"
                />
                <myinput
                    name="重复新密码"
                    v-model="mopwd"
                    :diable_flag="false"
                    :show_password="true"
                    placeholder="请再次输入新密码"
                    tips="请检查输入"
                    :showTips="showPwdTips"
                />

                <div style="margin-top: 30px">
                    <el-button color="#05a7e1" @click="toggle_page"
                        >返回</el-button
                    >
                    <el-button color="#05a7e1" @click="updatePwd"
                        >提交修改</el-button
                    >
                </div>
            </div>

            <div class="head_content">
                <el-upload
                    class="avatar-uploader"
                    :action="action"
                    name="file"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                >
                    <img
                        v-if="imageUrl"
                        :src="imageUrl"
                        class="avatar"
                        alt="avatar"
                    />
                    <img
                        v-else
                        :src="user.pic || defaultAvatar"
                        class="avatar"
                        alt="avatar"
                    />
                </el-upload>
                <div class="head_title">头像设置</div>
            </div>
        </div>
    </div>
</template>
<script  setup>
import { ref, computed, watch } from "vue";
import {
    getUser,
    triggerRefresh,
    storeData,
    updateUser,
} from "@/utils/MvPublic";
import { updateUserData } from "@/utils/api";
import { ElMessage } from "element-plus";
import myinput from "@/components/update/input.vue";

const opwd = ref("");
const npwd = ref("");
const mopwd = ref("");

const flag_page = ref(true);
const diable_flag = ref(true);
const showPwdTips = ref(true);
const showOldPwd = ref(true);
const showNewPwd = ref(true);

const btn_text = ref("点击编辑");

// 切换显示页面
const toggle_page = () => {
    flag_page.value = !flag_page.value;
};
// 基本信息修改
const updateClick = () => {
    if (btn_text.value === "提交修改") {
        storeData(user.value, "token");
        updateUserData(user.value);
        ElMessage.success("已提交修改!");
        triggerRefresh();
    }
    btn_text.value = btn_text.value === "提交修改" ? "点击编辑" : "提交修改";
    diable_flag.value = !diable_flag.value;
};
// 上传成功回调
const handleAvatarSuccess = (response) => {
    if (response && response.url) {
        imageUrl.value = response.url; // 修改当前显示的图片
        triggerRefresh(); // 刷新其他页面
        const userdata = {
            UserId: user.value.UserId,
            pic: response.url,
        };
        updateUser(response.url); // 更新本地存储
        updateUserData(userdata); // 更新数据库
    }
};
// 密码修改
const updatePwd = async () => {
    // 验证密码是否一致
    if (npwd.value) {
        showPwdTips.value = npwd.value.trim() === mopwd.value.trim(); // 返回 false 显示tips
        if (!showPwdTips.value) {
            return;
        }
        showNewPwd.value =
            npwd.value.trim().length >= 6 && npwd.value.trim().length <= 20;
        if (!showNewPwd.value) {
            return;
        }
        const userdata = {
            UserId: user.value.UserId,
            oldPassword: opwd.value.trim(),
            password: npwd.value.trim(),
        };
        const response = await updateUserData(userdata); // 修改数据库
        if (response.code === 200) {
            opwd.value = "";
            npwd.value = "";
            mopwd.value = "";
            ElMessage.success("修改成功");
        }
        // 密码错误
        if (response.code === 400) {
            showOldPwd.value = false;
        }
    }
};
// 监听 opwd 长度变化
watch(
    () => opwd.value.length,
    () => {
        if (!showPwdTips.value) showPwdTips.value = true;
    }
);
// 监听 npwd 长度变化
watch(
    () => npwd.value.length,
    () => {
        if (!showNewPwd.value) showNewPwd.value = true;
    }
);
// 监听 mopwd 长度变化
watch(
    () => mopwd.value.length,
    () => {
        if (!showOldPwd.value) showOldPwd.value = true;
    }
);

// 头像修改
const imageUrl = ref(null);
const action = process.env.VUE_APP_UPLOAD_URL; // 请求路由
const defaultAvatar = "https://s.tutu.pm/tx/0.png"; // 默认头像图片路径
const user = computed(() => {
    return getUser();
});
</script>
<style  scoped>
.updateContent {
    margin-top: 30px;
}
.updateContent .title {
    height: 45px;
    border-bottom: solid 1px #ddd;
    padding: 0 25px;
    overflow: hidden;
}
.updateContent .title h3 {
    font-family: Microsoft YaHei;
    font-size: 20px;
    height: 45px;
    line-height: 45px;
    margin: 0;
    font-weight: normal;
}
</style>
<style lang="css">
@import "@/assets/css/updateUser.css";
</style>

