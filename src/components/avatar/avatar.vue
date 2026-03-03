<script setup>
import { computed } from 'vue'

const props = defineProps({
  imageProfile: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'offline',
    validator: (value) =>
      ['online', 'offline', 'busy', 'away'].includes(value)
  }
})

const statusColor = computed(() => {
  switch (props.status) {
    case 'online':
      return '#22c55e'
    case 'busy':
      return '#ef4444'
    case 'away':
      return '#f59e0b'
    default:
      return '#6b7280'
  }
})
</script>

<template>
  <div class="avatar">
    <img
      v-if="imageProfile"
      :src="imageProfile"
      alt="avatar"
    />
    <div v-else class="fallback">
      <i class="ri-user-line"></i>
    </div>

    <span
      class="status"
      :style="{ backgroundColor: statusColor }"
    ></span>
  </div>
</template>

<style scoped>
.avatar {
  --w-avatar: 50px;
  --h-avatar: 50px;
  --s-avatar: 4px;
  --r-avatar: 50%;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--w-avatar);
  height: var(--h-avatar);
  border-radius: var(--r-avatar);
  border: solid 2px var(--green5);
  cursor: pointer;
  transition: border-color .4s ease;
}

.avatar:hover {
  border-color: var(--dark1);
}

.avatar:active {
  transform: scale(.95);
}

.avatar img {
  width: calc(var(--w-avatar) - var(--s-avatar));
  height: calc(var(--h-avatar) - var(--s-avatar));
  border: solid 1px var(--dark1);
  border-radius: var(--r-avatar);
  object-fit: cover;
  transition: filter .3s ease;
}

.avatar img:hover {
  filter: grayscale(100%);
}

.fallback {
  width: calc(var(--w-avatar) - var(--s-avatar));
  height: calc(var(--h-avatar) - var(--s-avatar));
  border-radius: 50%;
  background: var(--green6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--green4);
  font-size: 22px;
}

/* indicador de status */
.status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--dark1);
}
</style>
