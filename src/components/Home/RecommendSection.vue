<template>
    <div class="wrap">
        <h2>
            {{ title }}
            <span class="exchange-btn right">
                <div class="btn btn-light biRepeat" @click="handleChange">
                    <i class="bi bi-arrow-repeat"></i>
                    换一换
                </div>
                <RouterLink
                    class="btn btn-light"
                    :to="{
                        name: name2,
                    }"
                >
                    更多
                    <i class="cmore"></i>
                </RouterLink>
            </span>
        </h2>
        <RecommendList
            :list="rec"
            :loading="loading"
            :name="name"
            @linkToDt="linkToDt"
        />
    </div>
</template>

<script setup>
import RecommendList from "./RecommendList.vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    title: String,
    obid: Number,
    rec: Array,
    loading: Boolean,
    index: Object,
    name: String,
    name2: String,
});

const emit = defineEmits(["change", "onImageLoad", "linkToDt"]);
const linkToDt = (id, name) => {
    emit("linkToDt", id, name);
};
const handleChange = () => emit("change", props.index);
const loadImage = () => {
    emit("onImageLoad");
};
</script>
<style>
.wrap {
    margin-bottom: 20px;
}
</style>
