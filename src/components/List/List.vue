<template>
    <div class="wrap">
        <ul class="content-list" v-if="!movies">
            <li v-for="(i, id) in 14" :key="id">
                <div class="li-img"></div>
                <div class="li-bottom"></div>
            </li>
        </ul>
        <ul class="content-list" v-else>
            <li v-for="(item, index) in movies" :key="index">
                <div class="li-img">
                    <a
                        :title="item.List1.title"
                        @click="linkToDt(item.List1.mvId)"
                    >
                        <picture>
                            <img
                                :src="item.List1.cover"
                                :alt="item.List1.title"
                            />
                        </picture>
                        <span class="bottom">
                            <span v-if="item.List1.hotNum !== ' '"
                                ><i class="bi bi-fire"></i
                                >{{ item.List1.hotNum }}</span
                            >
                            <span class="biPlay"
                                ><i class="bi bi-play-circle"></i
                                >{{ item.List1.quality }}</span
                            >
                        </span>
                    </a>
                </div>
                <div class="li-bottom">
                    <h3>
                        <a
                            :title="item.List1.title"
                            onmouseover="this.style.color='#d81e06';"
                            onmouseout="this.style.color='black';"
                            @click="linkToDt(item.List1.mvId)"
                            >{{ item.List1.title }}</a
                        >
                        <span>{{ item.List1.rate }}</span>
                    </h3>
                    <div class="tag">
                        {{
                            item.List1.year +
                            "/" +
                            item.List1.country +
                            "/" +
                            item.List1.cate
                        }}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup >
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const route = useRoute();
const props = defineProps({
    movies: Object,
    loading: Boolean,
});
const emit = defineEmits(["loadImage"]);

const name = ref("");
if (route.path.includes("mv")) {
    name.value = "mvdt";
} else if (route.path.includes("ct")) {
    name.value = "ctdt";
} else {
    name.value = "tvdt";
}

const linkToDt = (id) => {
    const routeData = router.resolve({
        name: name.value,
        params: { id: Number(id) },
    });
    window.open(routeData.href, "_blank");
};
</script>
<style lang="css">
@import "@/assets/css/mv.css";
</style>