import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const user = ref(useStorage('user', {}))
  const cca = ref(useStorage('cca', {}))
  const inventory = ref(useStorage('inventory', []))
  const events = ref(useStorage('events', []))

  const clear = () => {
    user.value = {}
    cca.value = {}
    inventory.value = []
    events.value = []
  }
  return { user, cca, inventory, events, clear }
})
