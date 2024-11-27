<template>
    <ul class="content-list" v-show="!true">
        <li v-for="(item, index) in list" :key="index">
            <ImageLoader :src="item.cover" />
            <div class="li-bottom"></div>
        </li>
    </ul>
    <ul class="content-list" v-show="true">
        <li v-for="(item, index) in list" :key="index">
            <div class="li-img">
                <a
                    :title="item.title"
                    @click="handleLinkToDt(item.mvId, name), console.log(name)"
                >
                    <picture>
                        <img
                            :src="item.cover"
                            :alt="item.title"
                            @load="loadImg"
                        />
                    </picture>
                    <span class="bottom">
                        <span v-if="item.hotNum !== ' '"
                            ><i class="bi bi-fire"></i>{{ item.hotNum }}</span
                        >
                        <span class="biPlay"
                            ><i class="bi bi-play-circle"></i
                            >{{ item.quality }}</span
                        >
                    </span>
                </a>
            </div>
            <div class="li-bottom">
                <h3>
                    <a
                        :title="item.title"
                        onmouseover="this.style.color='#d81e06';"
                        @click="linkToDt(item.mvId, name)"
                        onmouseout="this.style.color='black';"
                        >{{ item.title }}</a
                    >
                    <span>{{ item.rate }}</span>
                </h3>
                <div class="tag">
                    {{ item.year + "/" + item.country + "/" + item.cate }}
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup>
import ImageLoader from "./ImageLoader.vue";
import { useRouter } from "vue-router";

const props = defineProps({
    list: Array,
    loading: Boolean,
    name: String,
});
const router = useRouter();
const emit = defineEmits(["onImageLoad", "linkToDt"]);
const handleLinkToDt = (id, name) => {
    emit("linkToDt", id, name);
};
const loadImg = () => {
    emit("onImageLoad");
};
</script>
<style>
.li-bottom a:hover {
    color: red;
}
</style>