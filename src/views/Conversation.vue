<script setup>
import { onMounted, ref } from 'vue';
import { Emitter } from '@/utils/Emitter';
import { useRoute } from 'vue-router'
import ListContacts from '@/constants/listaContatos.js'

const { params } = useRoute();


const id = params.id
const currentConversation = ref(filterById(ListContacts, id))


Emitter.emit('set-conversation', { 
  nickname: currentConversation.value.nickname,
  imageProfile: currentConversation.value.imageProfile,
  status: currentConversation.value.status
})

function filterById(arr, id) {
  return arr.find(item => item.id === id);
}

onMounted(() => {
  Emitter.emit('active-btn-back')
  Emitter.emit('show-conversation')
})
</script>

<template>
  <main class="conversation page">
    conversa {{ id }}
    <hr>
    <p>{{ currentConversation }}</p>
  </main>
</template>

<style scoped>
.conversation {
  padding: var(--p);
}
</style>
