<script setup lang="ts">
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'

const pb = inject(pbSymbol)
const userStore = useUserStore()
</script>

<template>
  <div class="grid-row sm:grid-cols-2 place-items-stretch w-xl">
    <AInput label="Item Name" value="Enter item name" />

    <!-- 👉 Custom label -->
    <AInput id="form-x" value="user@domain.com" type="email">
      <template #label>
        <label for="a-input-form-x">
          <span>Awesome </span>
          <span class="text-red">*</span>
        </label>
      </template>
    </AInput>
  </div>
</template>
