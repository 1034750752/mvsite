<template>
    <div class="user-management">
        <div class="user_manage_head">
            <!-- 搜索框 -->
            <el-input
                v-model="searchQuery"
                placeholder="搜索用户"
                class="search-input"
                @keyup.enter="handleSearch"
            />
            <el-button type="primary" @click="handleSearch"
                ><el-icon><Search /></el-icon
            ></el-button>
            <!-- 添加按钮 -->
            <el-button
                type="primary"
                @click="handleAdd"
                :disabled="user.level !== 0"
                >添加管理员</el-button
            >
            <span class="userinfo">
                欢迎您~ {{ user.nickname }}
                {{ user.level === 0 ? "超级管理员" : "管理员" }}
            </span>
        </div>
        <!-- 用户表格 -->
        <el-table
            :data="userData"
            style="width: 100%"
            :show-overflow-tooltip="true"
        >
            <el-table-column
                prop="UserId"
                label="ID"
                width="50"
            ></el-table-column>
            <el-table-column
                prop="uname"
                label="用户名"
                width="150"
            ></el-table-column>
            <el-table-column
                prop="nickname"
                label="昵称"
                width="150"
            ></el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="200"
            ></el-table-column>

            <el-table-column
                prop="password"
                label="密码"
                width="100"
            ></el-table-column>
            <!-- 自定义头像显示 -->
            <el-table-column prop="pic" label="头像" width="100">
                <template #default="scope">
                    <img
                        :src="scope.row.pic"
                        alt="头像"
                        style="
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            object-fit: cover;
                        "
                    />
                </template>
            </el-table-column>
            <el-table-column prop="level" label="级别" width="110">
                <template #default="scope">
                    {{ handleLevelText(scope.row.level) }}
                </template></el-table-column
            >
            <!-- 操作列 -->
            <el-table-column label="操作" width="180">
                <template v-slot="scope">
                    <el-button
                        @click="handleEdit(scope.row)"
                        type="primary"
                        :disabled="handleControls(scope.row.level)"
                        >编辑</el-button
                    >
                    <el-button
                        @click="handleDelete(scope.row)"
                        type="danger"
                        :disabled="handleControls(scope.row.level)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            v-if="userData.length > 10"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalValue"
            @current-change="handlePageChange"
            layout="total, prev, pager, next, jumper"
        />

        <!-- 添加/编辑用户对话框 -->
        <el-dialog title="用户信息" width="400px"> 添加新用户 </el-dialog>
    </div>
    <!-- 添加管理员 -->
    <el-dialog title="添加管理员" width="500px" v-model="dialog_addmana">
        <form @submit.prevent="submitForm" class="addmana">
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

            <button type="submit" name="button" id="button">点击确认</button>
        </form>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" width="500px" v-model="dialog_edit">
        <form @submit.prevent="submitEdit" class="addmana">
            <!-- 电子邮箱 -->
            <div class="logli">
                <label class="title">电子邮箱</label>
                <div>
                    <el-input
                        type="email"
                        name="username"
                        v-model="user_edit.email"
                        placeholder="请输入邮件地址，长度2-30位"
                    />
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
                        @blur="blurPwd"
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
                        @focus="foucsPwd"
                        @input="moPasswordInput"
                        @blur="blurPwd"
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
            <!-- 用户等级 -->
            <div class="level_edit">
                用户等级
                <select v-model="user_edit.level">
                    <option value="1">普通用户</option>
                    <option value="-1">管理员</option>
                </select>
            </div>
            <div style="margin-bottom: 20px"></div>
            <div class="tipsback" style="color: red" v-show="showGeneralError">
                {{ generalErrorMessage }}
            </div>

            <button type="submit" name="button" id="button">点击确认</button>
        </form>
    </el-dialog>
    <!-- 删除用户弹窗 -->
    <el-dialog v-model="dialog_delete" title="提示" width="500">
        <span>确定删除此用户？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialog_delete = false">取消</el-button>
                <el-button type="primary" @click="submitDelete">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import { SearchUserData, updateUserData } from "@/utils/api";
import { getUser } from "@/utils/MvPublic";
import { ElMessage } from "element-plus";
import axios from "../../store/axios";

// 获取用户
const currentPage = ref(1);
const userData = ref([]);
const totalValue = ref(0);
const searchQuery = ref("");
const pageSize = ref(10); // 每页显示的用户数量

// 添加管理员
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

const dialog_addmana = ref(false);
// 编辑用户信息
const dialog_edit = ref(false);
const user_edit = ref(null);
const originalUserData = reactive({
    email: "",
    level: "",
});
// 删除用户
const dialog_delete = ref(false);
const DeleteUserId = ref(null); // 记录当前要删除的用户 ID

const user = computed(() => {
    return getUser();
});
const getUsers = async () => {
    const { users, total } = await SearchUserData(
        currentPage.value,
        pageSize.value,
        searchQuery.value,
        user.value.UserId
    );
    userData.value = users;
    totalValue.value = total;
};

const handleControls = (level) => {
    if (user.value && user.value.level !== 0 && level !== 1) {
        return true;
    } else {
        return false;
    }
};
const handleLevelText = (level) => {
    if (level === 0) return "超级管理员";
    else if (level === -1) return "管理员";
    else if (level === 1) return "普通用户";
};
const handleSearch = () => {
    getUsers();
};

const handleAdd = () => {
    dialog_addmana.value = true;
};

const handleEdit = (user) => {
    dialog_edit.value = true;
    user_edit.value = user;
    originalUserData.email = user.email;
    originalUserData.level = user.level;
};
const submitEdit = async () => {
    if (password.value !== "" || mopassword.value !== "") {
        showPasswordError.value = password.value.trim().length < 6;
        showPasswordToLong.value = password.value.trim().length > 20;
        showMoPasswordTips.value = password.value !== mopassword.value;
    }
    if (
        showPasswordError.value ||
        showPasswordToLong.value ||
        showMoPasswordTips.value
    ) {
        return;
    }

    // 检查是否有信息修改
    const isChanged =
        user_edit.value.email !== originalUserData.email ||
        user_edit.value.level !== originalUserData.level ||
        password.value !== "";

    if (!isChanged) {
        dialog_edit.value = false;
        ElMessage.info("信息未改变，无需提交");
        return;
    }

    const userdata = {
        UserId: user_edit.value.UserId,
        password: password.value,
        email: user_edit.value.email,
        level: user_edit.value.level,
    };

    const response = await updateUserData(userdata);
    console.log(response);
    ElMessage.success("更新成功!");
    getUsers();

    password.value = "";
    mopassword.value = "";
    dialog_edit.value = false;
};

const submitDelete = async () => {
    try {
        const response = await axios.delete("/user/delete", {
            params: { UserId: DeleteUserId.value },
        });
        // 检查响应
        if (response.status === 200) {
            const result = response.data;
            getUsers();
            dialog_delete.value = false;
            DeleteUserId.value = null;
            return result; // 返回成功响应数据
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
};

const handleDelete = (user) => {
    dialog_delete.value = true;
    DeleteUserId.value = user.UserId;
};

const handlePageChange = (page) => {
    currentPage.value = page;
    // 更新分页显示（假设不做额外的后台分页）
};

// 添加管理员
const foucsName = () => {
    if (!showUsernameError.value)
        showUsernameTips.value = username.value.trim().length === 0;
};
const foucsPwd = () => {
    if (!showPasswordError.value)
        showPasswordTips.value = password.value.trim().length === 0;
};
const blurPwd = () => {
    if (password.value === "" && mopassword.value === "") {
        showPasswordToLong.value = false;
        showPasswordError.value = false;
        showMoPasswordTips.value = false;
    }
    showPasswordTips.value = false;
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
            level: -1,
        });
        if (response.data.success) {
            ElMessage.success("添加成功!");
            dialog_addmana.value = false;
            getUsers();
            username.value = "";
            password.value = "";
            mopassword.value = "";
        } else {
            showGeneralError.value = true;
            generalErrorMessage.value =
                response.data.message || "添加失败，请检查您的电子邮箱和密码";
        }
    } catch (error) {
        if (
            error.response &&
            error.response.data &&
            error.response.data.message
        ) {
            // 从后端响应中获取 message
            generalErrorMessage.value = error.response.data.message;
        } else {
            // 未返回具体 message 时的通用错误处理
            generalErrorMessage.value = "添加失败，请稍后再试";
        }
        showGeneralError.value = true;
    }
};
onMounted(() => {
    getUsers();
});
</script>

<style scoped>
.user-management {
    padding: 20px;
}
.search-input {
    width: 300px;
    margin-bottom: 20px;
}
.el-pagination {
    margin: 50px 0 50px 0;
}
.user_manage_head {
    display: flex;
}
</style>

