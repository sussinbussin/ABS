<script setup lang="ts">
import { ref } from 'vue'

const showDialog = ref(false)

const isListView = ref(true)

const toggleView = () => {
  isListView.value = !isListView.value
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <h1 class="font-bold text-xl p-5 text-left">
      My Inventory
    </h1>

    <div class="flex w-2/3">
      <ABtn class="m-2 w-1/3" @click="toggleView()">
        <div v-if="isListView">List View</div>
        <div v-else>Card View</div>
      </ABtn>
    </div>

    <Suspense class="flex-grow">
      <InventoryTable v-if="isListView"/>
      <InventoryCard v-else />
    </Suspense>

    <div class="flex flex-row p-3 mb-auto" >
      <ABtn icon='i-bx-plus' class="ml-auto mr-1" @click="showDialog = true">Add Item</ABtn>
    </div>

    <ADialog v-model="showDialog">
      <AddItem :show-dialog="showDialog" @done="showDialog = false" />
    </ADialog>
  </div>
</template>

<style scoped></style>
