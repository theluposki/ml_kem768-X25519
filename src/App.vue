<script setup>
import { Emitter } from './utils/Emitter';
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import HeaderM from '@/components/headerM.vue'
import Menu from '@/components/menu.vue'

const activeMenu = ref(false);

Emitter.on('toogle-menu', () => {
  activeMenu.value = !activeMenu.value
  Emitter.emit('icon-close', activeMenu.value)
})

Emitter.on('close-menu', () => {
  activeMenu.value = false
  Emitter.emit('icon-close', activeMenu.value)
})
</script>

<template>
  <HeaderM />
  <Transition name="menu-slide">
    <Menu v-if="activeMenu" />
  </Transition>
  <RouterView />
</template>

<style scoped>
.menu-slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.menu-slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.menu-slide-enter-active {
  transition: transform .35s ease, opacity .35s ease;
}

.menu-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.menu-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.menu-slide-leave-active {
  transition: transform .35s ease, opacity .35s ease;
}
</style>
