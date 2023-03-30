<script setup lang="ts">
import { ref } from 'vue'
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useToast } from 'vue-toast-notification'

const pb = inject(pbSymbol)

const props = defineProps<{ itemName: string, items: Object }>();
const itemArr = Object.values(props.items)
const emit = defineEmits(['closeCardItem'])
const selectedConditions = ref<[]>([])
const selectedLoanStatus = ref<[]>([])

const toast = useToast()

const conditions = ['Working', 'Damaged', 'Disposed']
const loanStatus = ['Available for loan', 'Not available for loan', 'Out on loan', 'Under maintenance', 'To be disposed']

const updateCondition = (index: number, condition: string) => {
  selectedConditions.value[index] = condition
}

const updateLoanStatus = (index: number, loanStatus: string) => {
  selectedLoanStatus.value[index] = loanStatus
}

const updateItems = () => {
  try {
    itemArr.forEach(async (item, index) => {
      const updatedCondition = selectedConditions.value[index] || item.asset_condition
      const updatedLoanStatus = selectedLoanStatus.value[index] || item.loan_status

      if (updatedCondition !== item.asset_condition || updatedLoanStatus !== item.loan_status) {
        if (updatedCondition !== item.asset_condition) {
          item.asset_condition = updatedCondition
        }

        if (updatedLoanStatus !== item.loan_status) {
          item.loan_status = updatedLoanStatus
        }
        await pb?.collection('assets').update(item.id, item)
      }
    })
    toast.open({
      type: 'success',
      message: 'Items updated successfully',
      position: 'bottom'
    })
  } catch (err: any) {
    toast.open({
      type: 'error',
      message: err,
      position: 'bottom'
    })
  }
}

const onConfirm = () => {
  updateItems()
  emit('closeCardItem')
}
</script>

<template>
  <div>
    <div>
      <div class="grid grid-cols-4 justify-between text-gray-4 font-semibold">
        <div class="px-4">Asset Tag</div>
        <div class="px-4">Location</div>
        <div class="px-5">Condition</div>
        <div class="px-5">Loan Status</div>
      </div>
      <div v-for="(e, index) in itemArr" :key="e.asset_tag">
        <div class="grid grid-cols-4 justify-between">
          <div class="flex items-center border border-gray-7 rounded-lg m-2 p-2 bg-gray-8 opacity-50">{{ e.asset_tag }}
          </div>
          <div class="flex items-center border border-gray-7 rounded-lg m-2 p-2 bg-gray-8 opacity-50">{{
            e.location_of_asset }}
          </div>
          <select @change="updateCondition(index, $event.target.value)"
            class="bg-black flex items-center border border-gray-8 rounded-lg m-2 p-2">
            <option value="" disabled selected hidden>{{ e.asset_condition || "Available for loan" }}</option>
            <option v-for="option in conditions" :key="option" :value="option">{{ option }}</option>
          </select>
          <select @change="updateLoanStatus(index, $event.target.value)"
            class="bg-black flex items-center border border-gray-8 rounded-lg m-2 p-2">
            <option value="" disabled selected hidden>{{ e.loan_status }}</option>
            <option v-for="option in loanStatus" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="flex flex-row fixed bottom-25% p-2 justify-between">
      <ABtn @click="$emit('closeCardItem')" class="w-1/2 mr-2">Cancel</ABtn>
      <ABtn @click="onConfirm" class="w-1/2 ml-2" color="success" variant="light">Confirm</ABtn>
    </div>
  </div>
</template>

<style scoped></style>