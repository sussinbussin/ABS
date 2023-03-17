<script setup lang="ts">
import { ref } from 'vue'

const showDialog = ref(false)

</script>

<template>
  <div class="block h-screen">
    <h1 class="font-bold text-xl p-5 text-left">
      My Inventory
    </h1>
    <Suspense>
      <InventoryTable class="m-5" />
    </Suspense>
    <div class="flex flex-row p-3">
      <ABtn icon='i-bx-plus' class="ml-auto mr-1" @click="showDialog = true">Add Item</ABtn>
    </div>
    <ADialog v-model="showDialog">
      <AddItem :showDialog="showDialog" @done="showDialog = false" />
    </ADialog>
  </div>
</template>

<style scoped></style>
