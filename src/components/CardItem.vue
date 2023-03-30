<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import { pbSymbol } from '~/symbols/injectionSymbols'

const props = defineProps<{ itemName: string; items: Object }>()
const emit = defineEmits(['closeCardItem'])
const pb = inject(pbSymbol)
const router = useRouter()

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

const navigate = (id: string) => {
  router.push(`/assets/${id}`)
}

const itemArr = computed(() => {
  return Object.values(props.items)
})
const updateItems = () => {
  try {
    itemArr.value.forEach(async (item, index) => {
      const updatedCondition = selectedConditions.value[index] || item.asset_condition
      const updatedLoanStatus = selectedLoanStatus.value[index] || item.loan_status

      if (updatedCondition !== item.asset_condition || updatedLoanStatus !== item.loan_status) {
        if (updatedCondition !== item.asset_condition)
          item.asset_condition = updatedCondition

        if (updatedLoanStatus !== item.loan_status)
          item.loan_status = updatedLoanStatus

        await pb?.collection('assets').update(item.id, item)
      }
    })
    toast.open({
      type: 'success',
      message: 'Items updated successfully',
      position: 'bottom',
    })
  }
  catch (err: any) {
    toast.open({
      type: 'error',
      message: err,
      position: 'bottom',
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
      <div
        class="grid grid-cols-4 justify-between text-gray-4 font-semibold"
        style="grid-template-columns: 1.5fr 1fr 0.75fr 1.5fr;"
      >
        <div class="px-4">
          Asset Tag
        </div>
        <div class="px-4">
          Location
        </div>
        <div class="px-5">
          Condition
        </div>
        <div class="px-5">
          Loan Status
        </div>
      </div>
      <div class="h-300px overflow-y-scroll">
        <div v-for="(e, index) in itemArr" :key="e.asset_tag">
          <div class="grid grid-cols-4 justify-between" style="grid-template-columns: 1.5fr 1fr 0.75fr 1.5fr;">
            <div class="flex items-center justify-between border border-gray-7 rounded-lg m-2 p-2 bg-gray-8 opacity-50">
              <div>{{ e.asset_tag }}</div>
              <div>
                <ABtn
                  class="text-xs" icon="i-bx-link-external" icon-only color="default" variant="text"
                  @click="navigate(e.id)"
                />
              </div>
            </div>
            <div
              class="flex items-center border border-gray-7 rounded-lg m-2 p-2 bg-gray-8 opacity-50"
              style="grid-column: span 1 / span 2;"
            >
              {{ e.location_of_asset || '-' }}
            </div>
            <select
              class="bg-black flex items-center border border-gray-8 rounded-lg m-2 p-2"
              @change="updateCondition(index, $event.target.value)"
            >
              <option value="" disabled selected hidden>
                {{ e.asset_condition || "Available for loan" }}
              </option>
              <option v-for="option in conditions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <select
              class="bg-black flex items-center border border-gray-8 rounded-lg m-2 p-2"
              @change="updateLoanStatus(index, $event.target.value)"
            >
              <option value="" disabled selected hidden>
                {{ e.loan_status }}
              </option>
              <option v-for="option in loanStatus" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row p-2 justify-between">
      <ABtn class="w-1/2 mr-2" @click="$emit('closeCardItem')">
        Cancel
      </ABtn>
      <ABtn class="w-1/2 ml-2" color="success" variant="light" @click="onConfirm">
        Confirm
      </ABtn>
    </div>
  </div>
</template>

<style scoped></style>
