<script setup>
import { onMounted } from 'vue';
import { Emitter } from '@/utils/Emitter';

onMounted(() => {
  Emitter.emit('active-btn-menu')
})
</script>

<template>
  <main class="setup page">
    Configurações
  </main>
</template>

<style scoped>
.setup {
  padding: var(--p);
}
</style>
