<template>
    <dl class="c0">
        <dt>类型：</dt>

        <dd>
            <a
                v-show="true"
                v-for="(item, value) in cateArray"
                :key="value"
                :class="{ on: selectCates.includes(value) }"
                @click="cates(value)"
                >{{ item }}</a
            >
        </dd>
    </dl>
</template>
<script setup>
import { useCateSelection } from "@/utils/cate";
const cateArray = [
    "全部",
    "剧情",
    "科幻",
    "动作",
    "喜剧",
    "爱情",
    "冒险",
    "儿童",
    "歌舞",
    "音乐",
    "奇幻",
    "动画",
    "恐怖",
    "惊悚",
    "丧尸",
    "战争",
    "传记",
    "纪录",
    "犯罪",
    "悬疑",
    "西部",
    "灾难",
    "古装",
    "武侠",
    "家庭",
    "短片",
    "校园",
    "文艺",
    "运动",
    "青春",
    "同性",
    "励志",
    "人性",
    "美食",
    "女性",
    "治愈",
    "历史",
    "真人秀",
    "脱口秀",
    "多选",
];
const { selectCates, cateValues, cates } = useCateSelection(cateArray);
</script>
<!-- <style lang="sass" scoped src= "@/assets/css/list.css"></style> -->