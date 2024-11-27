<template>
    <dl class="c2">
        <dt>年代：</dt>
        <dd>
            <!-- <a class="on">全部</a> -->
            <a
                v-for="(item, value) in yearArray"
                :key="value"
                :class="{ on: selectYears.includes(value) }"
                @click="years(value)"
                >{{ item }}</a
            >
        </dd>
    </dl>
    <dl class="c3">
        <dt>地区：</dt>
        <dd>
            <!-- <a class="on">全部</a> -->
            <a
                v-for="(item, value) in countryArray"
                :key="value"
                :class="{ on: selectCountry === value }"
                @click="country(value)"
                >{{ item }}</a
            >
        </dd>
    </dl>
</template>
<script setup>
import { useYearSelection, useCountrySelection } from "@/utils/cate";
const yearArray = [
    "全部",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "20年代",
    "10年代",
    "00年代",
    "更早",
];
const countryArray = [
    "全部",
    "大陆",
    "香港",
    "台湾",
    "美国",
    "日本",
    "韩国",
    "英国",
    "法国",
    "德国",
    "印度",
    "泰国",
    "瑞典",
    "巴西",
    "加拿大",
    "俄罗斯",
    "意大利",
    "比利时",
    "西班牙",
    "澳大利亚",
    "印尼",
    "沙特阿拉伯",
];
const emit = defineEmits(["updatayearValues", "updatacountryValues"]);
const { selectYears, yearValues, years } = useYearSelection(
    yearArray
    // emit
);
const { selectCountry, countryValue, country } = useCountrySelection(
    countryArray
    // emit
);
</script>
<!-- <style lang="sass" scoped src= "@/assets/css/list.css"></style> -->