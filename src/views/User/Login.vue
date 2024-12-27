<template>
    <div class="login-box">
        <h2>登录</h2>
        <form @submit.prevent="openDialog">
            <div class="logli">
                <label class="title">用户名/邮件地址</label>
                <div>
                    <el-input
                        type="text"
                        name="username"
                        placeholder="请输入用户名/邮件地址"
                        v-model="username"
                        @input="nameinput"
                        @focus="
                            showUsernameTips =
                                username.trim().length === 0 ? true : false
                        "
                        @blur="showUsernameTips = false"
                    />
                </div>
                <div class="tips" v-show="showUsernameTips">
                    可以使用用户名和电子邮件地址登录
                </div>
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
            <div class="logli">
                <label class="title"
                    >密码<span class="right">
                        <!-- <a href="/user/repassword" tabindex="-1"
                            >忘记密码</a
                        > -->
                    </span></label
                >

                <div class="password_input">
                    <el-input
                        type="password"
                        name="password"
                        placeholder="请输入密码"
                        v-model="password"
                        @input="passwordInput"
                        @focus="
                            showPasswordTips =
                                password.trim().length === 0 ? true : false
                        "
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
            <!-- <div class="reme">
                <input
                    type="checkbox"
                    v-model="rememberMe"
                    id="cookietime"
                    name="cookietime"
                />
                <label for="cookietime">记住登录</label>
            </div> -->
            <div style="margin-bottom: 20px"></div>
            <div class="tipsback" v-show="showGeneralError">
                {{ generalErrorMessage }}
            </div>

            <button type="submit" name="button" id="button">登录</button>
        </form>
        <div class="login-footer">
            还没有账号？<a href="/user/regist">创建新账号</a>
        </div>
    </div>
    <!-- 使用子组件 -->
    <verify
        v-model:dialogVisible="dialogVisible"
        @verify-success="handleSuccess"
    />
</template>

<script lang="ts"  setup>
import { ref } from "vue";
import axios from "../../store/axios";
import { triggerRefresh } from "@/utils/MvPublic";
import verify from "../../components/login/verify.vue";
// 引入子组件

const dialogVisible = ref(false);
// 打开弹窗
const openDialog = () => {
    dialogVisible.value = true;
};

// 处理验证成功的回调
const handleSuccess = () => {
    dialogVisible.value = false;
    submitForm(); // 在验证成功后提交表单
};

const username = ref("");
const password = ref("");
// const rememberMe = ref(false);
const showUsernameTips = ref(false);
const showPasswordTips = ref(false);
const showUsernameError = ref(false);
const showUsernameToLong = ref(false);
const showPasswordError = ref(false);
const showPasswordToLong = ref(false);
const showGeneralError = ref(false);
const generalErrorMessage = ref("");

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
        const response = await axios.post("/login", {
            username: username.value.trim(),
            password: password.value.trim(),
        });
        if (response.data.success) {
            // Handle successful login
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
            }
            localStorage.setItem(
                "token",
                JSON.stringify(response.data.result.user)
            );
            window.location.href = "/";
            triggerRefresh(); // 刷新页面
        } else {
            showGeneralError.value = true;
            generalErrorMessage.value =
                response.data.message ||
                "登录失败，请检查您的用户名/电子邮箱和密码";
        }
    } catch (error) {
        showGeneralError.value = true;
        generalErrorMessage.value = "登录失败，请稍后再试";
        console.error("登录错误:", error);
    }
};
</script>


<style lang="css">
@import "@/assets/css/login.css";
</style>