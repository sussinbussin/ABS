import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const user = ref(useStorage('user', {}))
  const cca = ref(useStorage('cca', {}))

  const clear = () => {
    user.value = {}
    cca.value = {}
  }
  return { user, cca, clear }
})
