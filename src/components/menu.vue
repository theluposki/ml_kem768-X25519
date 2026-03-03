<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';
import { Emitter } from '@/utils/Emitter';

const handleClick = () => {
  Emitter.emit('close-menu')
}
</script>

<template>
  <div class="menu">
    ml_kem768-X25519

    <nav class="nav">
      <RouterLink to="/" class="nav-link" @click="handleClick" exact-active-class="active">
        <i class="ri-discuss-line"></i>
        <span>Conversas</span>
      </RouterLink>
      <RouterLink to="/setup" class="nav-link" @click="handleClick" exact-active-class="active">
        <i class="ri-settings-5-line"></i>
        <span>Configurações</span>
      </RouterLink>
      <RouterLink to="/about" class="nav-link" @click="handleClick" exact-active-class="active">
        <i class="ri-info-card-line"></i>
        <span>Sobre</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.menu {
  position: absolute;
  z-index: 10;
  top: var(--header);
  left: var(--leftMenu);

  background-color: var(--green6);

  width: var(--w-menu);
  height: calc(var(--h) - var(--header));

  border-top: solid 2px var(--green5);

  padding: var(--p);

  display: flex;
  flex-direction: column;
  gap: var(--p);
}

.nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  & .nav-link {
    text-decoration: none;
    color: var(--blue1);

    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 var(--p);

    width: 100%;
    height: var(--wh-btn);
    min-height: var(--wh-btn);

    border-radius: 4px;

    &:active {
      scale: .95;
    }

    &.active {
      background-color: var(--green5);
    }
  }
}
</style>
