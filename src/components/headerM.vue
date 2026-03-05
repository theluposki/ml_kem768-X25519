<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router';
import { Emitter } from '@/utils/Emitter';
import { useMyUserStore } from '@/stores/myuser'
import Avatar from './avatar/avatar.vue';

const { back } = useRouter();

const myUserStore = useMyUserStore();

const perfil = computed(() => myUserStore.myUser)

const hamburguerLine = ref(false);
const showBackButton = ref(false);
const showMenuButton = ref(true);
const showConversation = ref(false);

const currentConversation = ref({})

Emitter.on('set-conversation', (value) => {
  currentConversation.value = value
})

const isFullscreen = ref(false)

const backToPage = () => {
  showConversation.value = false
  back()
}

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

Emitter.on('active-btn-back', () => {
  showBackButton.value = true
  showMenuButton.value = false
  Emitter.emit('close-menu')
})

Emitter.on('active-btn-menu', () => {
  showMenuButton.value = true
  showBackButton.value = false
})

Emitter.on('icon-close', (value) => {
  hamburguerLine.value = value
})

Emitter.on('show-conversation', () => {
  showConversation.value = true
  showMenuButton.value = false
  showBackButton.value = true
})
const toogleMenu = () => {
  Emitter.emit('toogle-menu')
}
</script>

<template>
  <header class="headerM">
    <div class="left">

      <div class="btn-menu" v-if="showMenuButton" @click="toogleMenu">
        <i class="ri-menu-unfold-2-line" v-if="hamburguerLine"></i>
        <i class="ri-menu-line" v-else></i>
      </div>
      <div class="btn-back" @click="backToPage" v-if="showBackButton">
        <i class="ri-arrow-left-long-line"></i>
      </div>
    </div>

    <div class="center" @click="toggleFullscreen" v-if="showConversation === false">
      <img src="@/assets/logo3.png" alt="logo">
    </div>

    <div class="right" v-if="showConversation === false">
      <!-- <span>{{ perfil.nickname }}</span> -->
      <RouterLink to="/myPerfil" class="avatar">
        <img :src="perfil.imageProfile" alt="avatar">
      </RouterLink>
    </div>

    <div class="headerConversation" v-if="showConversation">
      <span>{{ currentConversation.nickname }}</span>
      <Avatar :imageProfile="currentConversation.imageProfile" :status="currentConversation.status" />
    </div>
  </header>
</template>

<style scoped>
.headerM {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 var(--p);

  height: var(--header);
  background-color: var(--green6);

  --w-left: 40%;
  --w-center: 20%;
  --w-right: 40%;
}

.left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--w-left);

  --wh-btn-menu: 36px;

  & .btn-menu,
  & .btn-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--wh-btn-menu);
    height: var(--wh-btn-menu);
    background-color: transparent;
    border-radius: 0px;
    cursor: pointer;

    &:hover {
      transition: background-color ease .4s, border-radius ease 1.5s;
      background-color: var(--green5);
      border-radius: 4px;
    }

    &:active {
      scale: .95;
    }
  }

  & i {
    font-size: 28px;
  }
}

.center {
  display: flex;
  justify-content: center;
  width: var(--w-center);

  --wh-logo: 76px;

  & img {
    width: var(--wh-logo);
    height: var(--wh-logo);
    object-fit: cover;
  }
}

.right {
  width: var(--w-right);
  --w-avatar: 50px;
  --h-avatar: 50px;
  --s-avatar: 4px;
  --r-avatar: 50%;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;

  & span {
    font-family: 'Fira Code', monospace;
    color: var(--green1);
    font-weight: 200;
    text-transform: lowercase;
  }

  & .avatar {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--w-avatar);
    height: var(--h-avatar);
    border-radius: var(--r-avatar);
    border: solid 2px var(--green5);
    cursor: pointer;

    &:hover {
      transition: border-color ease .8s;
      border-color: var(--dark1);
    }

    &:active {
      scale: .95;
    }

    & img:hover {
      transition: filter ease .4s;
      filter: grayscale(100%);
    }

    & img {
      width: calc(var(--w-avatar) - var(--s-avatar));
      height: calc(var(--h-avatar) - var(--s-avatar));
      border: solid 1px var(--dark1);
      border-radius: var(--r-avatar);
      object-fit: cover;
    }
  }
}

.headerConversation {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
