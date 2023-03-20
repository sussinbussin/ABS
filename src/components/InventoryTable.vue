<script setup lang="ts">
import { ref } from 'vue'
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'
import { onMounted } from 'vue';

const userStore = useUserStore()

const showEditDialog = ref(false)

//TODO: Retrieve inventory should it not exist
onMounted(async () => {

})

const cols = [
  { name: 'id', hidden: true },
  { name: 'name', hidden: false },
  { name: 'qty', hidden: false },
  { name: 'actions', hidden: false },
]

const tableData = computed(() => {
  return userStore.inventory.map(({ name, qty, id }) => ({ id, name, qty }))
})

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
          <th v-for="item in cols" v-if="id != 'id'">{{ item.name }}</th>
        </tr>
      </thead>
      <tbody class="">
        <tr v-for="item in tableData">
          <td v-for="row in item">
            {{ row }}
          </td>
          <td class="px-3 py-2">
            <ABtn class="text-xs" icon="i-bx-link-external" icon-only color="default" variant="text" />
            <ABtn class="text-xs" icon="i-bx-edit-alt" icon-only variant="text" color="default" />
            <ABtn class="text-xs" icon="i-bx-trash" icon-only variant="text" color="default" @click="trash()" />
          </td>
        </tr>
      </tbody>
    </table>
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
