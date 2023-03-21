<script setup lang="ts">
import { ref } from 'vue'
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'
import { onMounted } from 'vue';

const userStore = useUserStore()
const pb = inject(pbSymbol)

const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const deleteTemp = ref("")
const editName = ref("")
const editQty = ref(0)
const editId = ref("")

const retrieveInventory = async () => {
  const inventoryRes = await pb?.collection('inventory').getFullList(500, {
    filter: `cca.id="${userStore.cca.id}"`,
  })

  userStore.inventory = inventoryRes
}
//TODO: Retrieve inventory should it not exist
onMounted(async () => {
  retrieveInventory()
})


const cols = [
  { name: 'id', show: false },
  { name: 'name', show: true },
  { name: 'qty', show: true },
  { name: 'actions', show: true },
]

const tableData = computed(() => {
  return userStore.inventory.map(({ name, qty, id }) => ({ id, name, qty }))
  // //return userStore.inventory.map(item => {
  //   cols.forEach(col => {
  //
  //   })
  // })
})

const trash = (id: string) => {
  showDeleteDialog.value = true
  deleteTemp.value = id
}

const trashConfirm = async () => {
  await pb?.collection('inventory').delete(deleteTemp.value)

  deleteTemp.value = ""
  await retrieveInventory()
  showDeleteDialog.value = false

}

const edit = (id: string) => {
  showEditDialog.value = true
  let item = userStore.inventory.find(item => item.id === id)
  editId.value = id
  editName.value = item.name
  editQty.value = item.qty
}

const submitEdit = async () => {
  await pb?.collection('inventory').update(editId.value, {
    name: editName.value,
    qty: editQty.value
  })

  await retrieveInventory()
  showEditDialog.value = false
}
</script>

<template>
  <div class="w-full p-3 max-h-700px overflow-y-scroll">
    <!-- ABtn -->
    <!--   icon=" i-bx-plus" variant="outline" onclick="location.href='/addProducts';" -->
    <!--   class="mt-5 float-left absolute left-9" -->
    <!-- > -->
    <!--   Add Products -->
    <!--Btn -->

    <!-- <ADataTable v-motion-pop :cols="cols" :rows="userStore.inventory" search multi-sort :page-size="10"> -->
    <!--   <template #col-actions> -->
    <!--     <div class="flex"> -->
    <!--       <ABtn class="text-xs" icon="i-bx-link-external" icon-only color="default" variant="text" /> -->
    <!--       <ABtn class="text-xs" icon="i-bx-edit-alt" icon-only variant="text" color="default" /> -->
    <!--       <ABtn class="text-xs" icon="i-bx-trash" icon-only variant="text" color="default"></ABtn> -->
    <!--     </div> -->
    <!--   </template> -->
    <!-- </ADataTable> -->
    <table class="relative w-full border-separate">
      <thead class="sticky top-0 border-bottom">
        <tr>
          <th v-for="item in cols" v-show="item.show">{{ item.name }}</th>
        </tr>
      </thead>
      <tbody class="">
        <tr v-for="item in tableData">
          <td v-for="row in item">
            {{ row }}
          </td>
          <td class="px-3 py-2">
            <ABtn class="text-xs" icon="i-bx-link-external" icon-only color="default" variant="text" />
            <ABtn class="text-xs" icon="i-bx-edit-alt" icon-only variant="text" color="default" @click="edit(item.id)" />
            <ABtn class="text-xs" icon="i-bx-trash" icon-only variant="text" color="default" @click="trash(item.id)" />
          </td>
        </tr>
      </tbody>
    </table>
    <ADialog v-model="showEditDialog" title="Edit Item">
      <form class="grid-row place-items-stretch p-5" @submit.prevent="submitEdit">
        <AInput v-model="editName" placeholder="name" type="text" class-text-sm />
        <AInput v-model="editQty" placeholder="qty" type="number" class-text-sm />
        <ABtn>Submit</ABtn>
      </form>
    </ADialog>
    <ADialog v-model="showDeleteDialog" title="Deleting Item" text="Are you sure?">
      <div class="p-5">
        <ABtn w-full class="mb-3" variant="light" color="danger" @click="trashConfirm">Yes</ABtn>
        <ABtn w-full @click="showDeleteDialog = false">Cancel</ABtn>
      </div>
    </ADialog>
  </div>
</template>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(229, 231, 235, 0.5)
}

thead::after {
  position: absolute;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5)
}
</style>
