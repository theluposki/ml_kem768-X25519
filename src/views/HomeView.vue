<script setup>
import { onMounted } from 'vue';
import { Emitter } from '@/utils/Emitter';

onMounted(() => {
  Emitter.emit('active-btn-menu')
})
</script>

<template>
  <main class="home page">
    <h1>ML_KEM + X25519</h1>
  </main>
</template>

<style scoped>
.home {
  padding: var(--p);
}
</style>
