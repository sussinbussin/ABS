<script setup lang="ts">
import { ref } from 'vue'
import { pbSymbol } from '~/symbols/injectionSymbols'

const pb = inject(pbSymbol)

const props = defineProps<{ itemName: string, items: Object }>();
const itemArr = Object.values(props.items)
const emit = defineEmits(['closeCardItem'])
const selectedConditions = ref<[]>([])
const selectedLoanStatus = ref<[]>([])

const conditions = ['Working', 'Damaged', 'Disposed']
const loanStatus = ['Available for loan', 'Not available for loan', 'Out on loan', 'Under maintenance', 'To be disposed']

const updateCondition = (index: number, condition: string) => {
  itemArr[index].asset_condition = condition
  selectedConditions.value[index] = condition
}

const updateLoanStatus = (index: number, loanStatus: string) => {
  itemArr[index].loan_status = loanStatus
  selectedLoanStatus.value[index] = loanStatus
}

const updateItems = () => {
  itemArr.forEach(async item => {
    await pb?.collection('assets').update(item.id, item)
  })
}

const onConfirm = () => {
  updateItems()
  emit('closeCardItem')
}
</script>

<template>
  <div>
    <div>
      <div v-for="(e, index) in itemArr" :key="e.asset_tag">
        <div class="grid grid-cols-3 justify-between">
          <div class="flex items-center border border-gray-7 rounded-lg m-2 p-2 bg-gray-8 opacity-50">{{ e.asset_tag }}
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
          <ABtn @click="onConfirm" class="w-1/2 ml-2" color="warning" variant="light">Confirm</ABtn>
    </div>
  </div>
</template>

<style scoped></style>