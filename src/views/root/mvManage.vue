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
            <!-- 添加按钮 -->
            <el-button type="primary" @click="handleAdd">添加新影片</el-button>
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
                    <select v-model="sortBy" @change="getBdData">
                        <option value="">默认排序</option>
                        <!-- <option value="date">放映时间</option> -->
                        <option value="year">年份排序</option>
                        <option value="rate">评分最高</option>
                        <option value="hotNum">热度最高</option>
                    </select>
                </div>
            </div>
        </div>
        <!-- 用户表格 -->
        <el-table
            :data="moviesData"
            style="width: 100%"
            :show-overflow-tooltip="true"
        >
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

            <!-- 操作列 -->
            <el-table-column label="操作" width="180">
                <template v-slot="scope">
                    <el-button
                        @click="handleEdit(scope.row.mvId)"
                        type="primary"
                        >编辑</el-button
                    >
                    <el-button
                        @click="handleDelete(scope.row.mvId)"
                        type="danger"
                        >删除</el-button
                    >
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
    </div>
    <!-- 删除影片弹窗 -->
    <el-dialog v-model="dialog_delete" title="提示" width="500">
        <span>确定删除此影片？</span>
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
import { onMounted, ref, watch } from "vue";
import { fetchListData } from "@/utils/api";
import { useRouter } from "vue-router";
import axios from "@/store/axios";

// 获取电影
const currentPage = ref(1);
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

const getBdData = async () => {
    movies.value = [];
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
    moviesData.value = movieMap.map((item) => item.List1);
};

// 搜索
const handleSearch = () => {
    getBdData();
};

const router = useRouter();

// 影片添加
const handleAdd = () => {
    window.open(router.resolve({ name: "mvManageAdd" }).href, "_blank");
};

//  影片编辑
const handleEdit = (mvId) => {
    window.open(
        router.resolve({
            name: "mvManageEdit",
            params: {
                mvId: mvId,
            },
        }).href,
        "_blank"
    );
};

// 影片删除
const dialog_delete = ref(false);
const DeleteMvId = ref(null);
const submitDelete = async () => {
    try {
        const response = await axios.delete("/mv/delete", {
            params: { mvId: DeleteMvId.value },
        });
        // 检查响应
        if (response.status === 200) {
            const result = response.data;
            dialog_delete.value = false;
            DeleteMvId.value = null;
            getBdData();
            return result; // 返回成功响应数据
        }
    } catch (err) {
        return null;
    }
};
const handleDelete = (mvId) => {
    dialog_delete.value = true;
    DeleteMvId.value = mvId;
};
// 分页
const handlePageChange = (page) => {
    currentPage.value = page;
    // 更新分页显示（假设不做额外的后台分页）
};
onMounted(() => {
    getBdData();
});
watch([currentPage, type, cate, year, country], () => {
    getBdData();
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
    margin-left: 50px;
    padding-top: 5px;
    color: #606266;
}
.sort select {
    color: #606266;
    outline: none;
}
</style>
