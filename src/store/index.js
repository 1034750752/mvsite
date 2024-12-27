// store/store.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        Collection: null, // 需要持久化
        seletSlides: [],
    }),
    actions: {
        setCollData(data) {
            this.Collection = data; // 更新 Collection
        },
        setSeletData(data) {
            this.seletSlides = data; // 更新 seletSlides
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: "userCollect", // 存储键名
                storage: localStorage,
                paths: ["Collection"], // 仅持久化 Collection
            },
            {
                key: "seletSlides", // 存储键名
                storage: localStorage,
                paths: ["seletSlides"], // 仅持久化 Collection
            },
        ],
    },
});
