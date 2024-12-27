<template>
    <div class="addmv">
        <el-form
            ref="formRef"
            :rules="rules"
            :model="form"
            label-width="auto"
            style="max-width: 600px"
            class="demo-form-inline"
        >
            <el-form-item label="影片标题" prop="title">
                <el-input v-model="form.title" placeholder="输入影片标题" />
            </el-form-item>
            <el-form-item label="上映时间">
                <el-date-picker
                    v-model="form.releseTime"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%"
                />
            </el-form-item>
            <!-- 将 地区、语言、片长 放在同一行 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="地区" prop="country">
                        <el-input
                            v-model="form.country"
                            placeholder="填写地区"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="语言" prop="language">
                        <el-input
                            v-model="form.language"
                            placeholder="填写语言"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="片长" prop="length">
                        <el-input
                            v-model="form.length"
                            placeholder="单位分钟"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="影片类型">
                <el-radio-group v-model="form.type">
                    <el-radio value="电影">电影</el-radio>
                    <el-radio value="剧集">剧集</el-radio>
                    <el-radio value="动漫">动漫</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="导演" prop="director">
                <el-input
                    v-model="form.director"
                    type="textarea"
                    placeholder="填写导演"
                />
            </el-form-item>
            <el-form-item label="编辑" prop="scriptwriter">
                <el-input
                    v-model="form.scriptwriter"
                    type="textarea"
                    placeholder="填写编辑"
                />
            </el-form-item>
            <el-form-item label="演员" prop="actor">
                <el-input
                    v-model="form.actor"
                    type="textarea"
                    placeholder="填写演员"
                />
            </el-form-item>
            <el-form-item label="分类" prop="cate">
                <el-input
                    v-model="form.cate"
                    type="textarea"
                    placeholder="输入分类"
                />
            </el-form-item>

            <el-form-item label="影片简介" prop="desc">
                <el-input
                    v-model="form.desc"
                    type="textarea"
                    placeholder="输入影片简介"
                />
            </el-form-item>
            <el-form-item>
                <el-button @click="goback">返回</el-button>
                <el-button type="primary" @click="onSubmit">提交添加</el-button>
            </el-form-item>
        </el-form>
        <div class="myupload">
            <myupload :imageUrl="cover" @updateUrl="updateSlideImg($event)" />
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import myupload from "@/components/update/upload.vue";
import { ElMessage } from "element-plus";
import { addmv } from "@/utils/api";
import { triggerRefresh } from "@/utils/MvPublic";
import { useRouter } from "vue-router";

const router = useRouter();
const goback = () => {
    router.push({ name: "MvManage" });
};
const form = reactive({
    title: "",
    releseTime: "",
    type: "电影",
    cate: "",
    director: "",
    scriptwriter: "",
    actor: "",
    country: "",
    language: "",
    length: "",
    desc: "",
});
const formRef = ref(null); // 用于绑定 el-form 的引用
const cover = ref("");
// 更新 cover
const updateSlideImg = (newUrl) => {
    cover.value = newUrl;
};

const onSubmit = () => {
    if (!formRef.value) return; // 确保 formRef 已绑定
    formRef.value.validate(async (valid) => {
        if (valid) {
            if (!cover.value) {
                ElMessage.error("请选择海报！");
                return;
            }
            const response = await addmv(
                form.title,
                form.releseTime,
                form.type,
                cover.value,
                form.cate,
                form.director,
                form.scriptwriter,
                form.actor,
                form.country,
                form.language,
                form.length,
                form.desc
            );
            if (response.status === 200) {
                ElMessage.success("添加成功");
                formRef.value.resetFields();
                cover.value = "";
                form.releseTime = "";
                triggerRefresh();
            }
        }
    });
};

const rules = reactive({
    title: [
        { required: true, message: "影片标题不能为空", trigger: "blur" },
        {
            min: 3,
            max: 50,
            message: "长度需在 3 到 50 个字符之间",
            trigger: "blur",
        },
    ],
    releaseTime: [
        { required: true, message: "请选择上映时间", trigger: "change" },
    ],
    country: [{ required: true, message: "请填写地区", trigger: "blur" }],
    language: [{ required: true, message: "请填写语言", trigger: "blur" }],
    length: [
        { required: true, message: "请填写片长", trigger: "blur" },
        { pattern: /^\d+$/, message: "片长必须是数字", trigger: "blur" },
    ],
    director: [{ required: true, message: "请填写导演信息", trigger: "blur" }],
    scriptwriter: [
        { required: true, message: "请填写编辑信息", trigger: "blur" },
    ],
    actor: [{ required: true, message: "请填写演员信息", trigger: "blur" }],
    cate: [{ required: true, message: "请输入分类", trigger: "blur" }],
    desc: [
        { required: true, message: "请输入影片简介", trigger: "blur" },
        {
            min: 10,
            max: 500,
            message: "简介长度需在 10 到 500 个字符之间",
            trigger: "blur",
        },
    ],
});
</script>

<style scoped>
.myupload {
    margin: 100px 0 0 40px;
}
.avatar-uploader {
    border: 1px solid #dddd;
}
.addmv {
    margin: 50px auto;
    display: flex;
}
</style>

