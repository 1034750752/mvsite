// changeTit.js
import { watch, ref } from "vue";

export function changeTit(title) {
    const defaultTitle = ref(document.title);

    watch(
        title,
        (newTitle) => {
            document.title = newTitle || defaultTitle.value;
        },
        { immediate: true }
    );
}
