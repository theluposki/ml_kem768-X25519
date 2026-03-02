import { defineStore } from 'pinia'
import { loadProfile } from '@/utils/profileStorage.js'

export const useMyUserStore = defineStore('myUser', {
  state: () => {
    const saved = loadProfile()

    
    return {
      myUser: saved ?? {
        nickname: '@bob',
        imageProfile: 'https://i.pravatar.cc/1024?img=33',
        imageCapa: '',
        hybridKeys: null
      }
    }
  }
})

