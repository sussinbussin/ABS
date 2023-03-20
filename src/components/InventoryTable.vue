<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// Retrieve inventory should it not exist
onMounted(async () => {

})

const cols = [
  // { name: 'id', isFilterable: true },
  { name: 'name', isFilterable: true },
  { name: 'qty', isFilterable: true },
  { name: 'actions', isFilterable: false },
]
</script>

<template>
  <div>
    <ADataTable v-motion-pop :cols="cols" :rows="userStore.inventory" search multi-sort :page-size="10">
      <template #col-actions>
        <div class="flex">
          <ABtn class="text-xs" icon="i-bx-link-external" icon-only color="default" variant="text" />
          <ABtn class="text-xs" icon="i-bx-edit-alt" icon-only variant="text" color="default" />
          <ABtn class="text-xs" icon="i-bx-trash" icon-only variant="text" color="default" />
        </div>
      </template>
    </ADataTable>
  </div>
</template>

<style scoped></style>
