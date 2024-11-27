<template>
    <div v-if="item">
        <span>{{ spanValue }}</span>
        <!-- 无展开 -->
        <i v-if="item.split('/').length < maxTags">
            <span v-for="(tag, index) in item.split('/')" :key="index">
                <a href="">{{ tag }}</a>
                <span v-if="index < item.split('/').length - 1"> / </span>
            </span>
        </i>

        <!-- 展开 -->
        <i v-else>
            <i
                v-for="(tag, index) in item.split('/').slice(0, maxTags)"
                :key="index"
            >
                <a href="">{{ tag }}</a>
                <span
                    v-if="index < item.split('/').slice(0, maxTags).length - 1"
                >
                    /
                </span>
            </i>
            <i>
                <span class="zk_zy" v-show="zkFlag" @click="toggleZk(false)">
                    / 展开...</span
                >
                <span class="sqzy_a" v-show="!zkFlag">
                    /
                    <i
                        v-for="(tag, index) in item.split('/').slice(maxTags)"
                        :key="index"
                    >
                        <a href="">{{ tag }}</a>
                        <span
                            v-if="
                                index <
                                item.split('/').slice(maxTags).length - 1
                            "
                        >
                            /
                        </span>
                    </i>
                    <span class="sq_zy" @click="toggleZk(true)">
                        / ...收起</span
                    >
                </span>
            </i>
        </i>
    </div>
</template>

<script setup>
const props = defineProps({
    spanValue: String,
    item: String,
    zkFlag: Boolean,
});
// 提取最大显示数量
const maxTags = parseInt(process.env.VUE_APP_DT_MAX, 10) || 0; // 确保为数字
const emits = defineEmits(["update:zkFlag"]);
const toggleZk = (state) => {
    emits("update:zkFlag", state);
};
</script>