<template>
    <div>
        <span v-for="(item, value) in name" :key="value">{{ item }}</span>
    </div>
    <span class="mao">:</span>
    <el-input
        type="text"
        v-model.trim="inputValue"
        @input="updateValue"
        :disabled="diable_flag"
        :show-password="show_password"
        :placeholder="placeholder"
    />
    <div class="tips">{{ showTips === false ? tips : "" }}</div>
</template>
<script setup>
import { ref, watch } from "vue";
// 接收 props
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    modelValue: {
        type: String,
        required: true,
    },
    diable_flag: {
        type: Boolean,
        required: true,
    },
    show_password: Boolean,
    placeholder: String,
    tips: String,
    showTips: Boolean,
});

// 向父组件发出更新的事件
const emit = defineEmits(["update:modelValue"]);

// 将输入的值同步到 modelValue
const inputValue = ref(props.modelValue);

// 监听 props.modelValue，确保 prop 变化时，inputValue 也更新
watch(
    () => props.modelValue,
    (newVal) => {
        inputValue.value = newVal;
    }
);

// 监听输入的变化，发送给父组件
const updateValue = (value) => {
    emit("update:modelValue", value);
};
</script>