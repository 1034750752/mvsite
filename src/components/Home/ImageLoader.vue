<template>
    <div class="li-img">
        <img :src="src" alt="" v-show="false" />
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    src: String,
});
</script>