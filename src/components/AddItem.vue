<script setup lang="ts">
import { inject, ref } from 'vue'

import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'

import { useToast } from 'vue-toast-notification'

const emit = defineEmits(['done'])
const pb = inject(pbSymbol)
const userStore = useUserStore()

const toast = useToast();
//TODO: add based on fields
const name = ref("")
const qty = ref(0)
const nameError = ref(true)
const qtyError = ref(true)

const nameValid = computed(() => {
  if (name.value) {
    nameError.value = false
    return ""
  } else {
    nameError.value = true
    return "Name cannot be empty!"
  }
})

const qtyValid = computed(() => {
  if (qty.value > 0) {
    qtyError.value = false
    return ""
  } else {
    qtyError.value = true
    return "Quantity must be more than 0!"
  }
})

const submit = async () => {
  if (!nameError.value && !qtyError.value) {
    try {
      const res = await pb?.collection('inventory').create({
        name: name.value,
        qty: qty.value,
        cca: userStore.cca.id
      })
      toast.open({
        type: "success",
        message: "Item Added!",
        position: "bottom"
      })

    } catch (err) {
      toast.open({
        type: "error",
        message: `${err}`,
        position: "bottom"
      })

    }

    const inventoryRes = await pb?.collection('inventory').getFullList(500, {
      filter: `cca.id="${userStore.cca.id}"`,
    })

    userStore.inventory = inventoryRes

    name.value = ""
    qty.value = 0

    emit("done")
  }
}
</script>

<template>
  <ACard title="Add Item" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="submit">
      <AInput v-model="name" :error="nameValid" placeholder="name" type="text" class-text-sm />
      <AInput v-model="qty" :error="qtyValid" placeholder="qty" type="number" class-text-sm />
      <ABtn>Submit</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
