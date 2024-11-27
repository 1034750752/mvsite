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
<script setup >
import { useCateSelection } from "@/utils/cate.js";
const cateArray = [
    "全部",
    "剧情",
    "萌系",
    "科幻",
    "日常",
    "战斗",
    "战争",
    "热血",
    "机战",
    "游戏",
    "搞笑",
    "恋爱",
    "后宫",
    "百合",
    "基腐",
    "冒险",
    "儿童",
    "歌舞",
    "音乐",
    "奇幻",
    "恐怖",
    "惊悚",
    "犯罪",
    "悬疑",
    "西部",
    "灾难",
    "古装",
    "武侠",
    "泡面",
    "运动",
    "体育",
    "青春",
    "美食",
    "治愈",
    "致郁",
    "励志",
    "历史",
    "纪录",
    "异世界",
    "多选",
];
const { selectCates, cateValues, cates } = useCateSelection(cateArray);
</script>
<!-- <style lang="sass" scoped src= "@/assets/css/list.css"></style> -->
