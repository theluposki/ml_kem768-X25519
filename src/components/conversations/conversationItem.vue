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
  },
  hybridKeys: {
    type: Object,
    default: []
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
    <div class="text">
      <span>{{ nickname }}</span>
      <!-- <span class="keys mlkem">{{ hybridKeys?.publicKey?.mlkem.substring(0, 45) }}</span> -->
      <span class="keys x255">{{ hybridKeys?.publicKey?.x25519.substring(0, 20) }}</span>
    </div>
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

.text {
  display: flex;
  flex-direction: column;
}

.keys {
  display: flex;
  align-self: flex-end;
  

  &.mlkem {
    color: var(--violet3);
    font-size: 8px;
  }

  &.x255 {
    color: var(--green5);
    font-size: 6px;
  }
}
</style>
