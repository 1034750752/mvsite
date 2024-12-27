<template>
    <div class="wrap">
        <ul class="content-list">
            <li v-for="(item, index) in movies" :key="index">
                <div class="li-img">
                    <a :title="item.title" @click="linkToDt(item, router)">
                        <picture>
                            <el-image
                                :src="item.cover"
                                :alt="item.title"
                                lazy
                            />
                        </picture>
                        <span class="bottom">
                            <span v-if="item.hotNum !== ' '"
                                ><i class="bi bi-fire"></i
                                >{{ item.hotNum }}</span
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
                            onmouseout="this.style.color='black';"
                            @click="linkToDt(item, router)"
                            >{{ item.title }}</a
                        >
                        <span>{{ item.rate }}</span>
                    </h3>
                    <div class="tag">
                        {{
                            item.year.trim() +
                            "/" +
                            item.country +
                            "/" +
                            item.cate
                        }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup >
import { useRouter } from "vue-router";
import { linkToDt } from "../../utils/MvPublic";
const router = useRouter();
const props = defineProps({
    movies: Object,
});
</script>
<style lang="css">
@import "@/assets/css/mv.css";
</style>