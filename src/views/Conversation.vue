<script setup>
import { onMounted } from 'vue';
import { Emitter } from '@/utils/Emitter';

onMounted(() => {
  Emitter.emit('active-btn-back')
})
</script>

<template>
  <main class="conversation page">
    conversa
  </main>
</template>

<style scoped>
.conversation {
  padding: var(--p);
}
</style>
