<template>
    <div class="login-box">
        <h2>登录</h2>
        <form @submit.prevent="submitForm">
            <div class="logli">
                <label class="title">用户名/邮件地址</label>
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="请输入用户名/邮件地址"
                        v-model="username"
                    />
                </div>
                <div class="tips" v-show="showUsernameTips">
                    可以使用用户名和电子邮件地址登录，昵称不能用于登录
                </div>
                <div class="tips" style="color: red" v-show="showUsernameError">
                    长度不能少于2个字符
                </div>
            </div>
            <div class="logli">
                <label class="title"
                    >密码<span class="right"
                        ><a href="/user/repassword" tabindex="-1"
                            >忘记密码</a
                        ></span
                    ></label
                >

                <div>
                    <input
                        type="text"
                        name="password"
                        placeholder="请输入密码"
                        v-model="password"
                    />
                </div>
                <div class="tips" v-show="showPasswordTips">
                    密码长度6-20位，区分大小写
                </div>
                <div class="tips" style="color: red" v-show="showPasswordError">
                    长度不能少于6个字符
                </div>
            </div>
            <div class="reme">
                <input
                    type="checkbox"
                    v-model="rememberMe"
                    id="cookietime"
                    name="cookietime"
                />
                <label for="cookietime">记住登录</label>
            </div>
            <!-- <div class="tipsback" v-show="showGeneralError">用户名或电子邮件格式不正确/账号或密码错误/账号不存在，请检查是否填写正确</div> -->
            <div class="tipsback" v-show="showGeneralError">
                {{ generalErrorMessage }}
            </div>

            <button type="submit" name="button" id="button">登录</button>
        </form>
        <div class="login-footer">
            还没有账号？<a href="/user/regist">创建新账号</a>
        </div>
    </div>
</template>

<script  setup>
import { ref } from "vue";
import axios from "../../store/axios";
const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const showUsernameTips = ref(false);
const showPasswordTips = ref(false);
const showUsernameError = ref(false);
const showPasswordError = ref(false);
const showGeneralError = ref(false);
const generalErrorMessage = ref("");

const submitForm = async () => {
    console.log(username.value, password.value);
    showUsernameError.value = username.value.length < 2;
    showPasswordError.value = password.value.length < 6;
    if (showUsernameError.value || showPasswordError.value) {
        return;
    }
    try {
        const response = await axios.post("/login", {
            username: username.value,
            password: password.value,
        });
        if (response.data.success) {
            // Handle successful login
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
            }
            console.log("登录成功", response.data.result.user);
            localStorage.setItem(
                "token",
                JSON.stringify(response.data.result.user)
            );
            window.location.href = "/";
        } else {
            showGeneralError.value = true;
            generalErrorMessage.value =
                response.data.message || "登录失败，请检查您的用户名和密码";
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