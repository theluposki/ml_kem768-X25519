<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="menu">
    menu
  </div>
</template>

<style scoped>
.menu {
  position: absolute;
  top: var(--header);
  left: var(--leftMenu);

  background-color: var(--green6);

  width: var(--w-menu);
  height: calc(var(--h) - var(--header));

  border-top: solid 2px var(--green5);

  padding: var(--p);
}
</style>
