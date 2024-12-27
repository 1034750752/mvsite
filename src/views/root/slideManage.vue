<template>
    <div class="user-management">
        <div class="user_manage_head">
            <!-- 搜索框 -->
            <el-input
                v-model="searchKey"
                placeholder="标题搜索"
                class="search-input"
                @keyup.enter="handleSearch"
            />

            <el-button type="primary" @click="handleSearch"
                ><el-icon><Search /></el-icon
            ></el-button>
            <!-- 轮播图配置 -->
            <el-button type="primary" @click="setSlide">轮播图配置</el-button>
            <div class="managemv_type">
                <a :class="{ on: type === '' }" @click="type = ''">全部</a>
                <a :class="{ on: type === '电影' }" @click="type = '电影'"
                    >电影</a
                >
                <a :class="{ on: type === '剧集' }" @click="type = '剧集'"
                    >剧集</a
                >
                <a :class="{ on: type === '动漫' }" @click="type = '动漫'"
                    >动漫</a
                >
            </div>

            <!-- 排序 -->
            <div class="sort">
                <div>
                    排序：
                    <select v-model="sortBy" @change="getSlidData">
                        <option value="">默认排序</option>
                        <!-- <option value="date">放映时间</option> -->
                        <option value="year">年份排序</option>
                        <option value="rate">评分最高</option>
                        <option value="hotNum">热度最高</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- 切换是否只显示已选中行 -->
        <el-switch
            v-model="showSelectedOnly"
            active-text="仅显示已选中"
            inactive-text="显示全部"
        />
        <!-- 用户表格 -->
        <el-table
            :data="filteredMoviesData"
            ref="movieTable"
            style="width: 100%"
            :show-overflow-tooltip="true"
            @select="handleSelect"
        >
            <el-table-column type="selection" width="55" />

            <el-table-column
                prop="mvId"
                label="ID"
                width="100"
            ></el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                width="200"
            ></el-table-column>
            <el-table-column
                prop="year"
                label="年份"
                width="100"
            ></el-table-column>
            <el-table-column
                prop="country"
                label="地区"
                width="130"
            ></el-table-column>

            <el-table-column
                prop="hotNum"
                label="热度"
                width="100"
            ></el-table-column>
            <el-table-column
                prop="quality"
                label="集数/质量"
                width="100"
            ></el-table-column>
            <el-table-column
                prop="rate"
                label="评分"
                width="100"
            ></el-table-column>
            <el-table-column
                prop="type"
                label="类型"
                width="100"
            ></el-table-column>
            <!-- 自定义头像显示 -->
            <el-table-column prop="cover" label="海报" width="150">
                <template #default="scope">
                    <el-image
                        :src="scope.row.cover"
                        alt="海报"
                        style="width: 100%; height: 100%; object-fit: cover"
                        lazy
                    />
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            v-if="movies.length > 10"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange"
            layout="total, prev, pager, next, jumper"
        />

        <!-- 编辑轮播的图片 -->
        <el-dialog title="轮播图配置" width="1200px" v-model="dialogVisible">
            <div class="slide_dialogContent">
                <div>
                    <div v-for="(item, index) in Slide_setting" :key="index">
                        <div class="slide_setting">
                            <div class="mvlist">
                                <h6>{{ item.title }}</h6>
                                <img :src="item.cover" />
                            </div>
                            <div class="mvslide">
                                <h6>轮播图编辑</h6>
                                <myUpload
                                    :imageUrl="handleImgUlr(item.slidImg)"
                                    @updateUrl="updateSlideImg(index, $event)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <el-button
                    type="primary"
                    @click="updateSlidImg"
                    style="float: right"
                    >提交修改
                </el-button>
            </div>
        </el-dialog>

        <!-- 返回顶部 -->
        <el-backtop :right="100" :bottom="100" />
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from "vue";
import { fetchListData, fetchSlides, changeSlides } from "@/utils/api";
import { useUserStore } from "@/store/index";
import { handleImgUlr } from "@/utils/MvPublic";
import myUpload from "@/components/update/upload.vue";
import { ElMessage } from "element-plus";

const currentPage = ref(1);
const userStore = useUserStore(); // 使用 Pinia Store
const pageSize = ref(40);
const total = ref(1000);
const movies = ref([]); // 接收 list 和 dt
const moviesData = ref([]); // 接收 list
const sortBy = ref("");
const type = ref("");

const searchKey = ref("");
const cate = ref([]);
const year = ref([]);
const country = ref("");

const movieTable = ref(null); // 获取表格的引用

const showSelectedOnly = ref(false); // 切换显示模式，控制是否只显示已选中的行
const slidesData = ref([]); // 接收 list
const slide = ref([]);
const Slide_setting = ref([]);
const maxSelections = 6; // 最大可选数量
const mvIdS = ref([]);

const dialogVisible = ref(false);

const getSlide_setting = () => {
    let result;
    result = userStore.seletSlides.map((item) => {
        let match = slide.value.find((entry) => entry.mvId === item.mvId);
        return {
            ...item,
            slidImg: match ? match.slidImg : {}, // 如果找到匹配项，追加其属性；否则不追加
        };
    });
    Slide_setting.value = result;
};
// 更新 Slide_setting 中对应的 slidImg
const updateSlideImg = (index, newUrl) => {
    Slide_setting.value[index].slidImg = newUrl; // 更新对应的 slidImg
};
const updateSlidImg = async () => {
    const data = Slide_setting.value.map((item) => ({
        mvId: item.mvId,
        slidImg: handleImgUlr(item.slidImg),
    }));
    await changeSlides(data);
    dialogVisible.value = false;
};
const getSlidData = async () => {
    movies.value = []; // 接收 List1 List2
    const { List1, List2, totalValue } = await fetchListData(
        cate.value,
        currentPage.value,
        pageSize.value,
        searchKey.value,
        type.value,
        year.value,
        country.value,
        sortBy.value
    );
    total.value = totalValue;
    movies.value = List1.map((item, index) => ({
        List1: item,
        List2: List2[index],
    }));
    const movieMap = movies.value;
    moviesData.value = movieMap.map((item) => item.List1); // 接收 List1

    const { mvIds, slides, List } = await fetchSlides();
    mvIdS.value = mvIds;
    slide.value = slides;
    slidesData.value = List.map((item) => item.List1); // 接收 List1
};
const getBdData = async () => {
    await getSlidData();
    userStore.setSeletData(slidesData.value);
    selectDefault();
    getSlide_setting();
};
// 计算表格中要显示的数据
const filteredMoviesData = computed(() => {
    return showSelectedOnly.value ? userStore.seletSlides : moviesData.value;
});
// 默认选中 sessionStorage 中保存的内容
const selectDefault = () => {
    nextTick(() => {
        const defaultSelectedIds = userStore.seletSlides || []; // 从 Pinia 中获取默认选中数据
        const mvids = defaultSelectedIds.map((item) => item.mvId);
        filteredMoviesData.value.forEach((row) => {
            if (mvids.includes(row.mvId)) {
                movieTable.value.toggleRowSelection(row, true);
            }
        });
    });
};

const setSlide = () => {
    if (userStore.seletSlides.length !== maxSelections) {
        ElMessage.error(`请选择 ${maxSelections} 个项目`);
        return;
    }
    dialogVisible.value = true;
};
const handleSelect = (row, index) => {
    const num = userStore.seletSlides.findIndex(
        (item) => item.mvId === index.mvId
    );
    if (num === -1) {
        // 如果不存在相同的行，添加新行
        userStore.seletSlides.push(index);
    } else {
        const data = userStore.seletSlides.filter(
            (item) => item.mvId !== index.mvId
        );
        userStore.setSeletData(data);
    }
    getSlide_setting();
};

const handlePageChange = (page) => {
    currentPage.value = page;
    // 更新分页显示（假设不做额外的后台分页）
};
const handleSearch = () => {
    getSlidData();
};
onMounted(() => {
    getBdData();
});
watch([currentPage, type, cate, year, country], () => {
    getSlidData();
});

// 监听数据切换，重新设置表格选中项
watch(filteredMoviesData, () => {
    selectDefault();
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
    margin: 50px 0 50px 200px;
}
.user_manage_head {
    display: flex;
}
.el-backtop {
    --el-backtop-bg-color: var(--el-color-primary);
    color: #fff;
}
.el-backtop:hover {
    background-color: var(--el-color-primary-light-3);
    color: var(--el-color-white);
}
.sort {
    font-size: 16px;
    margin-left: 30px;
    padding-top: 5px;
    color: #606266;
}
.sort select {
    color: #606266;
    outline: none;
}
</style>
