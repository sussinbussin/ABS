<script setup lang="ts">
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'

const pb = inject(pbSymbol)
const userStore = useUserStore()

const itemName = ref('')
const itemQty = ref()

const successModel = ref(false)
const failModel = ref(false)

const formData = new FormData();

function handleFiles(e: { target: { files: any; }; dataTransfer: { files: any; }; }) {
  var files = e.target.files || e.dataTransfer.files;
  if (!files.length)
    return;
  for (let file of files) {
    formData.append('image', file);
  }
}

const submitAddItem = async () => {
  try {
    formData.append('name', itemName.value);
    formData.append('qty', itemQty.value)
    formData.append('cca', userStore.cca.id)
    // upload and create new record
    await pb?.collection('inventory').create(formData);
    
    successModel.value = true

    itemName.value = ''
    itemQty.value = ''
  }
  catch (err) {
    failModel.value = true
  }
}

</script>

<template>
  <h1 class="font-bold text-xl p-5 text-left">
    Add Product
  </h1>
  <form @submit.prevent="submitAddItem" class="p-5">
    <ACard v-motion-pop class="w-2xl p-5">
      <div class="grid-row sm:grid-cols-2 place-items-stretch">
        <!-- 👉 Custom label -->
        <AInput id="form-x-qty" v-model="itemQty" value="Enter Item Quantity" type="number" min="1" class="text-left">
          <template #label>
            <label for="a-input-form-x-qty">
              <span>Quantity</span>
              <span class="text-red">*</span>
            </label>
          </template>
        </AInput>

        <AInput id="form-x-name" v-model="itemName" value="Enter item name" class="text-left">
          <template #label>
            <label for="a-input-form-x-name">
              <span>Item name</span>
              <span class="text-red">*</span>
            </label>
          </template>
        </AInput>

        <AInput v-on:change="handleFiles" inputClasses="a-input-form-x-image" value="Upload item image" type="file" ref="imgUpload"/>
      </div>

      <AAlert v-motion-pop color="success" class="mt" dismissible v-model=successModel>
        Item added
      </AAlert>

      <AAlert v-motion-pop color="danger" class="mt" dismissible v-model=failModel>
        Failed to add item
      </AAlert>

      <ABtn icon="i-bx-plus" variant="outline" class="float-right mt-5">
        Add
      </ABtn>
    </ACard>
  </form>
</template>