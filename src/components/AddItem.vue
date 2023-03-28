<script setup lang="ts">
import { inject, ref } from 'vue'

import { useToast } from 'vue-toast-notification'
import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'

const emit = defineEmits(['done'])
const pb = inject(pbSymbol)
const userStore = useUserStore()

const toast = useToast()
// TODO: add based on fields
const addedItem = ref({})

const formattedCols = computed(() => {
  return Object.keys(userStore.inventory[0])
    .filter(item => item !== "id" && item !== "expand")
    .map(item => {
      return {
        raw: item,
        formatted: item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      }
    })
})

// TODO: form validation
const submit = async () => {
  //TODO: add
  const res = await pb?.collection('assets').create(addedItem.value)

  if (res?.code) {
    //error
    toast.open({
      type: 'error',
      message: res?.message,
      position: 'bottom'
    })
  }
  const inventoryRes = await pb?.collection('assets').getFullList(500, {
    filter: `club="${userStore.cca.name}"`,
  })

  userStore.inventory = inventoryRes
  emit('done')
}
</script>

<template>
  <ACard title="Add Item" class="px-5 pb-6">
    <form class="" @submit.prevent="submit">
      <!-- <AInput v-model="name" :error="nameEmptyMsg" placeholder="name" type="text" class-text-sm /> -->
      <!-- <AInput v-model="qty" :error="qtyEmptyMsg" placeholder="qty" type="number" class-text-sm /> -->
      <div class="grid-row sm:grid-cols-3 place-items-stretch pb-3">
        <div v-for="item in formattedCols">
          <AInput v-model="addedItem[item.raw]" :label="item.formatted" type="text" class="text-sm" />
        </div>
      </div>
      <ABtn class="w-full">Submit</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
