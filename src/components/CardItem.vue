<script setup lang="ts">
import { DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue';

const props = defineProps<{ title: string, description: string }>();

const isOpen = ref(true)

  function setIsOpen(value) {
    isOpen.value = value
  }
</script>

<template>
  <DialogPanel class="bg-white">
    <div>{{ props.title }}</div>
    <div>{{ props.description }}</div>
  <!-- </DialogPanel> -->

  <!-- <DialogPanel> -->
      <DialogTitle>Deactivate account</DialogTitle>
      <DialogDescription>
        This will permanently deactivate your account
      </DialogDescription>

      <p>
        Are you sure you want to deactivate your account? All of your data will be
        permanently removed. This action cannot be undone.
      </p>

      <button @click="setIsOpen(false)">Deactivate</button>
      <button @click="setIsOpen(false)">Cancel</button>
    </DialogPanel>
</template>