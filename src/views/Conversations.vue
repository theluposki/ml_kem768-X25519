<script setup>
import { onMounted } from 'vue';
import { Emitter } from '@/utils/Emitter';
import SearchInput from '@/components/input.vue'
import listConversation from '@/components/conversations/conversationList.vue';

onMounted(() => {
  Emitter.emit('active-btn-menu')
})
</script>

<template>
  <main class="conversations page">
    <div class="wrapper-search">
      <SearchInput v-model="search" />

      <button class="btn btn-search">
        <i class="ri-user-add-line"></i>
      </button>
    </div>

    <listConversation />
  </main>
</template>

<style scoped>
.conversations {
  display: flex;
  flex-direction: column;
}

.wrapper-search {
  display: flex;
  align-items: center;
  gap: 2px;

  background-color: var(--green6);

  width: var(--w);
  height: var(--header);
  padding: 0 var(--p);
  border-bottom: solid 1px var(--green5);
}
</style>
