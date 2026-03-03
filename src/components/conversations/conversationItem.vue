<script setup>
import Avatar from '../avatar/avatar.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  imageProfile: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    default: 'anonymous'
  },
  status: {
    type: String,
    default: 'offline'
  }
})

const { push } = useRouter()



const goChat = () => {
  push(`/chat/${props.id}`)
}
</script>

<template>
  <li class="conversationItem" @click="goChat">
    <Avatar :imageProfile="imageProfile" :status="status" />
    <span>{{ nickname }}</span>
  </li>
</template>

<style scoped>
.conversationItem {
  width: var(--w);
  height: var(--header);
  min-height: var(--header);
  background-color: rgba(3, 20, 15, .2);

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 0 var(--p);

  &:active {
    scale: .95;
  }
}
</style>
