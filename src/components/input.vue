<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'procurar conversa'
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const internalValue = ref(props.modelValue)

// sincroniza quando valor externo mudar
watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

// emite atualização
watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

const clearSearch = async () => {
  internalValue.value = ''
  await nextTick()
  inputRef.value?.focus()
}
</script>

<template>
  <div class="search-wrapper">
    <input
      ref="inputRef"
      v-model="internalValue"
      class="input"
      type="search"
      :placeholder="placeholder"
    />

    <i
      v-if="internalValue"
      class="ri-close-line clear"
      @click="clearSearch"
    ></i>
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
}

.clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--green4);
  font-size: 18px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.clear:hover {
  transform: translateY(-50%) scale(1.1);
}
</style>
