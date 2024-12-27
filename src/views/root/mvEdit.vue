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
                    v-model="form.releaseTime"
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
                <el-button type="primary" @click="onSubmit">提交修改</el-button>
            </el-form-item>
        </el-form>
        <div class="myupload">
            <myupload :imageUrl="cover" @updateUrl="updateSlideImg($event)" />
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
import myupload from "@/components/update/upload.vue";
import { ElMessage } from "element-plus";
import { triggerRefresh } from "@/utils/MvPublic";
import { useRoute, useRouter } from "vue-router";
import { fetchMvData, editmv } from "@/utils/api";

// 根据id 获取 dt 和 list
const route = useRoute();
const id = route.params.mvId;
const mvData = ref([]);
const getmvData = async () => {
    const { List } = await fetchMvData(id);
    mvData.value = List;
};

const router = useRouter();
const goback = () => {
    router.push({ name: "MvManage" });
};
const form = reactive({
    title: "",
    releaseTime: "",
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

const originalForm = reactive({ ...form }); // 保存初始值
console.log(originalForm);

const hasChanges = () => {
    return Object.keys(form).some((key) => form[key] !== originalForm[key]);
};

const onSubmit = () => {
    if (!formRef.value) return; // 确保 formRef 已绑定
    formRef.value.validate(async (valid) => {
        if (valid) {
            // 检查是否有改动
            if (!hasChanges() && cover.value === mvData.value[0].List1.cover) {
                ElMessage.info("表单数据未改变，无需提交");
                return;
            }

            const response = await editmv(
                form.title,
                form.releaseTime,
                form.type,
                cover.value,
                form.cate,
                form.director,
                form.scriptwriter,
                form.actor,
                form.country,
                form.language,
                form.length,
                form.desc,
                id
            );
            if (response.status === 200) {
                ElMessage.success("修改成功");
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
onMounted(async () => {
    if (id) {
        // 编辑模式，加载电影数据
        await getmvData();
        if (mvData.value) {
            // 将 mvData 的值赋给表单
            Object.assign(form, {
                title: mvData.value[0].List1.title,
                releaseTime: mvData.value[0].List2.releaseTime,
                type: mvData.value[0].List1.type,
                cate: mvData.value[0].List2.cate,
                director: mvData.value[0].List2.director,
                scriptwriter: mvData.value[0].List2.scriptwriter,
                actor: mvData.value[0].List2.actor,
                country: mvData.value[0].List2.country,
                language: mvData.value[0].List2.language,
                length: parseInt(mvData.value[0].List2.length, 10),
                desc: mvData.value[0].List2.description,
            });
            cover.value = mvData.value[0].List1.cover; // 设置封面
            Object.assign(originalForm, { ...form }); // 保存初始表单值
        }
    }
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
