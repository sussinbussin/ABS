import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const user = ref(useStorage('user', {}))

  const clear = () => {
    user.value = {}
  }
  return { user, clear }
})
