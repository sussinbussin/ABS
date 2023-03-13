<script setup lang="ts">
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'

const pb = inject(pbSymbol)
const userStore = useUserStore()

const ccares = await pb?.collection('userDetails').getList(1, 50, {
  filter: `userid = "${userStore.user.id}"`,
})

// fetch a paginated records list
const res = await pb?.collection('inventory').getList(1, 500, {
  filter: `cca.id="${ccares?.items[0].ccaId}"`,
})

const items: { id: number; name: any; qty: any }[] = []

// TODO: clean up code idt its at the right spot
if (res) {
  const raw = res.items
  raw.forEach((x, idx) => items.push({ id: idx + 1, name: x.name, qty: x.qty }))
}

const cols = [
  { name: 'id', isFilterable: true },
  { name: 'name', isFilterable: true },
  { name: 'qty', isFilterable: true },
  { name: 'actions', isFilterable: false },
]
</script>

<template>
  <div>
    <ABtn icon="i-bx-plus" variant="outline" onclick="location.href='/addProducts';" class="mt-5 float-left absolute left-9">
      Add Products
    </ABtn>
    <ADataTable :cols="cols" :rows="items" search multi-sort :page-size="500">
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
