<script setup>
import { ref } from 'vue'
import ConversationItem from './conversationItem.vue'
import ListContatos from '@/constants/listaContatos.js'

const list = ref(ListContatos)
</script>

<template>
  <div class="emptyList">
    <span v-if="list.length === 0">Adicione contatos para iniciar conversas.</span>
  </div>
  <ul class="list-conversations">
    <ConversationItem v-for="item in list" :key="item.id" :id="item.id" :imageProfile="item.imageProfile" :nickname="item.nickname"
     :hybridKeys="item.hybridKeys" :status="item.status" />
  </ul>
</template>

<style scoped>
.list-conversations {
  list-style: none;

  width: var(--w);
  height: calc(var(--h) - 2 * var(--header));
  overflow-y: auto;
  padding: 0;
  padding-bottom: var(--p);

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.emptyList {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: var(--p);
}

</style>
