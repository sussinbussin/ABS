<script setup lang="ts">
import { inject, ref } from 'vue'

import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'

import { useToast } from 'vue-toast-notification'
import { error } from 'console'

const emit = defineEmits(['done'])
const pb = inject(pbSymbol)
const userStore = useUserStore()

const toast = useToast();
//TODO: add based on fields
const name = ref("")
const qty = ref(0)

const submit = async () => {
  try {
    if (name.value == "") {
      throw new Error("Name should not be empty")
    } else if (qty.value <= 0) {
      throw new Error("Value should not be less than or equal 0")
    }

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

  emit("done")

}
</script>

<template>
  <ACard title="Add Item" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="submit">
      <AInput v-model="name" placeholder="name" type="text" class-text-sm />
      <AInput v-model="qty" placeholder="qty" type="text" class-text-sm />
      <ABtn>Submit</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
