<script setup lang="ts">
import { pbSymbol } from '/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'
import { computed} from 'vue'

const props = defineProps(['id'])
const userStore = useUserStore()


const item = computed(() => {
  return userStore.inventory.find(e => e.id == props.id)
})
</script>

<template>
  <div class="flex flex-col h-screen p-5">
    <h1 class="font-bold text-xl text-left">Assets</h1>

  </div>
</template>

<style scoped>
</style>
