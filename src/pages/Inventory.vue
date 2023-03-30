<script setup lang="ts">
import { ref } from 'vue'

const showDialog = ref(false)

const isListView = ref(true)

const tableViews = ['Table View', 'Card View']

// TODO: save preferences in pb
const selectedView = ref('Table View')
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="flex flex-row">
      <h1 class="font-bold text-xl p-5 text-left">
        My Inventory
      </h1>
      <ASelect v-model="selectedView" class="py-5 text-xs grow-0 ml-auto pr-8" :options="tableViews" />
    </div>

    <Suspense>
      <InventoryTable v-if="selectedView == 'Table View'" />
      <InventoryCard v-else />
    </Suspense>

    <div class="flex flex-row p-3 mt-auto">
      <ABtn icon="i-bx-plus" class="ml-auto mr-1" @click="showDialog = true">
        Add Item
      </ABtn>
    </div>

    <ADialog v-model="showDialog">
      <AddItem :show-dialog="showDialog" @done="showDialog = false" />
    </ADialog>
  </div>
</template>

<style scoped></style>
