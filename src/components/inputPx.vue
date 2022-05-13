<template>
 <el-input-number v-model="num" :step="1" step-strictly />
</template>
<script lang="ts" setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(["update:modelValue"]);

const num = computed({
  get: () => {
    const value = props.modelValue.replace('px', '')
    return Number(value)
  },
  set: val => {
    emits('update:modelValue', `${val}px`)
  }
})

</script>