<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const pb = inject(pbSymbol)
const router = useRouter()

//Dialog Crud refs
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const deleteTemp = ref("")
const editItem = ref({})
const editId = ref("")

//filter option refs
const groupedItem = ref("")
const groupedTable = ref({})
const groupedShow = reactive({})
const selectedCols = ref({})
const showColsDialog = ref(false)

const search = ref("")

const retrieveInventory = async () => {
  const inventoryRes = await pb?.collection('assets').getFullList(500, {
    filter: `club="${userStore.cca.name}"`,
  })

  userStore.inventory = inventoryRes
}

//TODO: Retrieve inventory should it not exist
onMounted(async () => {
  await retrieveInventory()

  //set Columns
  //TODO: make it less hard coded
  selectedCols.value = {
    "asset_name": true,
    "loan_status": true,
    "category": true,
  }
})


//get all columns, raw and formatted
const allCols = computed(() => {
  return Object.keys(userStore.inventory[0])
    .map(item => {
      return {
        raw: item,
        formatted: item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      }
    })
})

//cols but according to the checked cols.
const formattedCols = computed(() => {
  return Object.keys(userStore.inventory[0])
    .filter(item => selectedCols.value[item])
    .map(item => {
      return {
        raw: item,
        formatted: item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      }
    })
})

//TODO: add debounce its laggy af
const displayedTable = computed(() => {
  //filter
  if (search.value === "") {
    return userStore.inventory
  }

  return userStore.inventory.filter(item => {
    let result = false
    Object.values(item).forEach(val => {
      if (typeof val === 'string') {
        if (val.toLowerCase().includes(search.value.toLowerCase())) {
          result = true
        }
      }
    })
    return result
  })
})

const group = (name: string) => {
  if (groupedItem.value === name) {
    groupedItem.value = ""
    return
  }
  groupedItem.value = name
  let tempTable = {}

  for (let item of displayedTable.value) {
    if (tempTable[item[name]] == undefined) {
      tempTable[item[name]] = []
      groupedShow[item[name]] = false
    }
    tempTable[item[name]].push(item)
  }
  groupedTable.value = tempTable
}

const handleGroupedClick = (item) => {
  groupedShow[item] = !groupedShow[item]
}
//Crud operations
const trash = (id: string) => {
  showDeleteDialog.value = true
  deleteTemp.value = id
}

const trashConfirm = async () => {
  await pb?.collection('assets').delete(deleteTemp.value)

  deleteTemp.value = ""
  await retrieveInventory()
  showDeleteDialog.value = false

}

const edit = (id: string) => {
  showEditDialog.value = true
  let item = userStore.inventory.find(item => item.id === id)
  editId.value = id
  editItem.value = item
}

const submitEdit = async () => {
  await pb?.collection('assets').update(editId.value, editItem.value)

  await retrieveInventory()
  showEditDialog.value = false
}


const navigate = (id) => {
  router.push('/assets/' + id)
}
</script>

<template>
  <div class="flex flex-row px-5">
    <AInput v-model="search" placeholder="Search" type="text" class="text-sm pr-3" />
    <ABtn variant="text" @click="showColsDialog = true" class="px-3">Edit Columns</ABtn>
  </div>
  <div class="w-full p-3 max-h-700px overflow-y-scroll">
    <table class="relative w-full border-separate">
      <thead class="sticky top-0 border-bottom">
        <tr>
          <th v-for=" item in formattedCols">
            <ABtn icon="i-bx-layer" :variant="item.raw == groupedItem ? 'outline' : 'text'" @click="group(item.raw)">
              {{ item.formatted }}
            </ABtn>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody class="">
        <tr v-for="item in displayedTable" v-if="groupedItem == ''">
          <td v-motion-pop v-for="row in formattedCols">
            {{ item[row.raw] }}
          </td>
          <td class="px-3 py-2">
            <ABtn class="text-xs" icon="i-bx-link-external" icon-only color="default" variant="text"
              @click="navigate(item.id)" />
            <ABtn class="text-xs" icon="i-bx-edit-alt" icon-only variant="text" color="default" @click="edit(item.id)" />
            <ABtn class="text-xs" icon="i-bx-trash" icon-only variant="text" color="default" @click="trash(item.id)" />
          </td>
        </tr>
        <tr v-for="item in groupedTable" v-else>
          <td v-motion-pop v-for="row in formattedCols">
            <ABtn :variant="groupedShow[item[0][groupedItem]] ? 'outline' : 'text'" v-if="row.raw == groupedItem"
              @click="handleGroupedClick(item[0][groupedItem])">
              {{ item[0][groupedItem] }}
            </ABtn>
            <ABtn v-else class="invisible"></ABtn>
            <br />
            <p v-if="groupedShow[item[0][groupedItem]]" v-for="e in item" class="py-3">{{ e[row.raw] }}</p>
          </td>
        </tr>
      </tbody>
    </table>
    <ADialog v-model="showEditDialog" title="Edit Item" class="w-[900px]">
      <form class="p-5" @submit.prevent="submitEdit">
        <!-- <AInput v-model="editName" placeholder="name" type="text" class-text-sm /> -->
        <!-- <AInput v-model="editQty" placeholder="qty" type="number" class-text-sm /> -->
        <div class="grid-row sm:grid-cols-3 place-items-stretch pb-3">
          <div v-for="item in formattedCols">
            <AInput v-model="editItem[item.raw]" :label="item.formatted" type="text" class-text-sm />
          </div>
        </div>
        <ABtn class="w-full p-2">Submit</ABtn>
      </form>
    </ADialog>
    <ADialog v-model="showDeleteDialog" title="Deleting Item" text="Are you sure?">
      <div class="p-5">
        <ABtn w-full class="mb-3" variant="light" color="danger" @click="trashConfirm">Yes</ABtn>
        <ABtn w-full @click="showDeleteDialog = false">Cancel</ABtn>
      </div>
    </ADialog>
    <ADialog class="p-5" v-model="showColsDialog" title="Table Columns"
      subtitle="Select properties you would like to see">
      <div class="grid-row sm:grid-cols-3 place-items-stretch px-5 pb-5">
        <ACheckbox v-for="item in allCols" v-model="selectedCols[item.raw]">
          {{ item.formatted }}
        </ACheckbox>
      </div>
      <ABtn class="w-full" @click="showColsDialog = false">Done</ABtn>
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

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #9A6BED;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #A489D4;
}
</style>
