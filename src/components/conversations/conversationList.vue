<script setup>
import { ref } from 'vue'
import ConversationItem from './conversationItem.vue'

const list = ref([
  {
    id: window.crypto.randomUUID(),
    nickname: 'Ana',
    imageProfile: 'https://i.pravatar.cc/1024?img=37',
    status: 'busy'
  },
  {
    id: window.crypto.randomUUID(),
    nickname: 'Roger',
    imageProfile: 'https://i.pravatar.cc/1024?img=34',
    status: 'online'
  },
  {
    id: window.crypto.randomUUID(),
    nickname: 'Geovana',
    imageProfile: 'https://i.pravatar.cc/1024?img=38',
    status: 'offline'
  },
  {
    id: window.crypto.randomUUID(),
    nickname: 'Sabrina',
    imageProfile: 'https://i.pravatar.cc/1024?img=40',
    status: 'away'
  },
  {
    id: window.crypto.randomUUID(),
    nickname: 'Natan',
    imageProfile: 'https://i.pravatar.cc/1024?img=12',
    status: 'away'
  },
  {
    id: window.crypto.randomUUID(),
    nickname: 'Rogerio',
    imageProfile: 'https://i.pravatar.cc/1024?img=11',
    status: 'away'
  },
    {
    id: window.crypto.randomUUID(),
    nickname: 'Thiago',
    imageProfile: 'https://i.pravatar.cc/1024?img=15',
    status: 'away'
  },
      {
    id: window.crypto.randomUUID(),
    nickname: 'Mia Kalifa',
    imageProfile: 'https://i.pravatar.cc/1024?img=41',
    status: 'away'
  },

])
</script>

<template>
  <ul class="list-conversations">
    <ConversationItem v-for="item in list" :key="item.id" :id="item.id" :imageProfile="item.imageProfile" :nickname="item.nickname"
      :status="item.status" />
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

</style>
