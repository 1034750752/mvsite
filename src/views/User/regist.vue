<template>
    <div class="login-box">
        <h2>注册</h2>
        <form @submit.prevent="submitForm">
            <!-- 电子邮箱 -->
            <div class="logli">
                <label class="title">电子邮箱</label>
                <div>
                    <el-input
                        type="email"
                        name="username"
                        v-model="username"
                        placeholder="请输入邮件地址"
                        @input="nameinput"
                        @focus="foucsName"
                        @blur="showUsernameTips = false"
                    />
                </div>
                <div class="tips" v-show="showUsernameTips">邮箱长度2-30位</div>
                <div class="tips" style="color: red" v-show="showUsernameError">
                    长度不能少于2个字符
                </div>

                <div
                    class="tips"
                    style="color: red"
                    v-show="showUsernameToLong"
                >
                    长度不能多于30个字符
                </div>
            </div>
            <!-- 密码 -->
            <div class="logli">
                <label class="title">密码</label>

                <div class="password_input">
                    <el-input
                        type="password"
                        name="password"
                        placeholder="请输入密码"
                        v-model="password"
                        @input="passwordInput"
                        @focus="foucsPwd"
                        @blur="showPasswordTips = false"
                        show-password
                    />
                </div>
                <div class="tips" v-show="showPasswordTips">
                    密码长度6-20位，区分大小写
                </div>
                <div class="tips" style="color: red" v-show="showPasswordError">
                    长度不能少于6个字符
                </div>
                <div
                    class="tips"
                    style="color: red"
                    v-show="showPasswordToLong"
                >
                    长度不能多于20个字符
                </div>
            </div>
            <!-- 再次密码 -->
            <div class="logli">
                <label class="title">再次输入密码</label>

                <div class="password_input">
                    <el-input
                        type="password"
                        name="password"
                        placeholder="请再次输入密码"
                        v-model="mopassword"
                        @input="moPasswordInput"
                        show-password
                    />
                </div>

                <div
                    class="tips"
                    style="color: red"
                    v-show="showMoPasswordTips"
                >
                    请确保两次输入的密码一致
                </div>
            </div>

            <div style="margin-bottom: 20px"></div>
            <div class="tipsback" style="color: red" v-show="showGeneralError">
                {{ generalErrorMessage }}
            </div>

            <button type="submit" name="button" id="button">点击注册</button>
        </form>
        <div class="login-footer">
            已有账号？<a href="/user/login">前往登录</a>
        </div>
    </div>
</template>

<script lang="ts"  setup>
import { ref } from "vue";

import axios from "../../store/axios";

const username = ref("");
const password = ref("");
const mopassword = ref("");
// const rememberMe = ref(false);
const showUsernameTips = ref(false);
const showPasswordTips = ref(false);
const showUsernameError = ref(false);
const showUsernameToLong = ref(false);
const showPasswordError = ref(false);
const showPasswordToLong = ref(false);
const showGeneralError = ref(false);
const showMoPasswordTips = ref(false);
const generalErrorMessage = ref("");
const foucsName = () => {
    if (!showUsernameError.value)
        showUsernameTips.value = username.value.trim().length === 0;
};
const foucsPwd = () => {
    if (!showPasswordError.value)
        showPasswordTips.value = password.value.trim().length === 0;
};
const moPasswordInput = () => {
    if (password.value.trim() !== mopassword.value.trim()) {
        showMoPasswordTips.value = true;
        return;
    }
    showMoPasswordTips.value = false;
};
const nameinput = () => {
    if (showUsernameTips.value === true) {
        showUsernameTips.value = false;
    }
    showUsernameError.value = username.value.trim().length < 2;
    showUsernameToLong.value = username.value.trim().length > 30;
};
const passwordInput = () => {
    if (showPasswordTips.value === true) {
        showPasswordTips.value = false;
    }
    showPasswordError.value = password.value.trim().length < 6;
    showPasswordToLong.value = password.value.trim().length > 20;
};
interface AxiosError {
    response?: {
        data?: {
            message?: string;
        };
    };
}
const submitForm = async () => {
    showUsernameError.value = username.value.trim().length < 2;
    showUsernameToLong.value = username.value.trim().length > 30;
    showPasswordError.value = password.value.trim().length < 6;
    showPasswordToLong.value = password.value.trim().length > 20;

    if (
        showUsernameError.value ||
        showPasswordError.value ||
        showUsernameToLong.value ||
        showPasswordToLong.value
    ) {
        return;
    }
    try {
        const response = await axios.post("/regist", {
            username: username.value.trim(),
            password: password.value.trim(),
        });
        if (response.data.success) {
            window.location.href = "/user/login";
        } else {
            showGeneralError.value = true;
            generalErrorMessage.value =
                response.data.message || "注册失败，请检查您的电子邮箱和密码";
        }
    } catch (error: unknown) {
        // 类型断言为可能的 AxiosError 类型
        const axiosError = error as AxiosError;
        if (
            axiosError.response &&
            axiosError.response.data &&
            axiosError.response.data.message
        ) {
            // 从后端响应中获取 message
            generalErrorMessage.value = axiosError.response.data.message;
        } else {
            // 未返回具体 message 时的通用错误处理
            generalErrorMessage.value = "注册失败，请稍后再试";
        }
        showGeneralError.value = true;
    }
};
</script>


<style lang="css">
@import "@/assets/css/login.css";
</style>