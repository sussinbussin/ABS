<script setup lang="ts">
import { DialogPanel, DialogDescription } from "@headlessui/vue"
import { ref } from 'vue'

const props = defineProps<{ itemName: string, items: Object }>();
const selectedConditions = ref<[]>([])
const selectedLoanStatus = ref<[]>([])

const conditions = ['Working', 'Damaged', 'Disposed']
const loanStatus = ['Available for loan', 'Not available for loan', 'Out on loan', 'Under maintenance', 'To be disposed']

const updateCondition = (index: string, condition: string) => {
  console.log("Selected condition: ", condition)
  selectedConditions.value[parseInt(index)] = condition // update the selected condition value for the corresponding record index
}

const updateLoanStatus = (index: string, loanStatus: string) => {
  console.log("Selected condition: ", index)
  console.log(selectedLoanStatus.value)
  selectedLoanStatus.value[parseInt(index)] = loanStatus // update the selected condition value for the corresponding record index
}

</script>

<template>
  <div>
    <div v-for="(e, index) in props.items" :key="e.asset_tag">
      <div class="grid grid-cols-3 justify-between">
        <div class="flex items-center border border-gray-7 rounded-lg m-2 p-2 bg-gray-8 opacity-50">{{ e.asset_tag }}
        </div>
        <select @change="updateCondition(index, $event.target.value)" class="bg-black flex items-center border border-gray-8 rounded-lg m-2 p-2">
          <option value="" disabled selected hidden>{{ e.asset_condition || "Available for loan"}}</option>
          <option v-for="option in conditions" :key="option" :value="option">{{ option }}</option>
        </select>
        <select @change="updateLoanStatus(index, $event.target.value)" class="bg-black flex items-center border border-gray-8 rounded-lg m-2 p-2">
          <option value="" disabled selected hidden>{{ e.loan_status }}</option>
          <option v-for="option in loanStatus" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped></style>