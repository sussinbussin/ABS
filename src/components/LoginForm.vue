<script setup lang="ts">
import { inject, ref } from 'vue'
import { pbSymbol } from "~/symbols/injectionSymbols"

const pb = inject(pbSymbol)

const username = ref("")
const password = ref("")

const login = async () => {
  try {
    const res = await pb.collection("users").authWithPassword(username.value, password.value);

    if (res) {
      //TODO: add to store
      console.log(res)
    }
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <ACard title="ABS" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="login">
      <AInput placeholder=" Username" type="text" prepend-inner-icon="i-bx-user" class="text-sm" v-model="username" />
      <AInput placeholder="Password" type="password" prepend-inner-icon="i-bx-lock" class="text-sm" v-model="password" />
      <ABtn>Login</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
