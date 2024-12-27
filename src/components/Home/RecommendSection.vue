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
        <List :movies="rec" />
    </div>
</template>

<script setup>
import List from "../List/List.vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    title: String,
    rec: Object,
    index: Object,
    name: String,
    name2: String,
});
const emit = defineEmits(["change"]);
const handleChange = () => emit("change", props.index);
</script>
<style>
.wrap {
    margin-bottom: 20px;
}
</style>
