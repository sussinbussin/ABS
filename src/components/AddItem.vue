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
const name = ref('')
const qty = ref(0)
const nameEmpty = ref(true)
const qtyEmpty = ref(true)

const nameEmptyMsg = computed(() => {
  if (name.value && name.value.trim()) {
    nameEmpty.value = false
    return ''
  }
  else {
    nameEmpty.value = true
    return 'Name cannot be empty!'
  }
})

const qtyEmptyMsg = computed(() => {
  if (qty.value > 0) {
    qtyEmpty.value = false
    return ''
  }
  else {
    qtyEmpty.value = true
    return 'Quantity must be more than 0!'
  }
})

const submit = async () => {
  if (!nameEmpty.value && !qtyEmpty.value) {
    try {
      const res = await pb?.collection('inventory').create({
        name: name.value,
        qty: qty.value,
        cca: userStore.cca.id,
      })
      toast.open({
        type: 'success',
        message: 'Item Added!',
        position: 'bottom',
      })
    }
    catch (err) {
      toast.open({
        type: 'error',
        message: `${err}`,
        position: 'bottom',
      })
    }

    const inventoryRes = await pb?.collection('inventory').getFullList(500, {
      filter: `cca.id="${userStore.cca.id}"`,
    })

    userStore.inventory = inventoryRes

    name.value = ''
    qty.value = 0

    emit('done')
  }
}
</script>

<template>
  <ACard title="Add Item" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="submit">
      <AInput v-model="name" :error="nameEmptyMsg" placeholder="name" type="text" class-text-sm />
      <AInput v-model="qty" :error="qtyEmptyMsg" placeholder="qty" type="number" class-text-sm />
      <ABtn>Submit</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
