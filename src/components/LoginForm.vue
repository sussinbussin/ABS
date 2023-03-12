<script setup lang="ts">
import { Collection } from 'pocketbase';
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'

const router = useRouter()

const pb = inject(pbSymbol)

const username = ref('')
const password = ref('')

const userStore = useUserStore()

const login = async () => {
  try {
    const res = await pb?.collection('users').authWithPassword(username.value, password.value)

    if (res) {
      userStore.user = res.record

      // get rest of the details
      const udres = await pb?.collection('userDetails').getList(1, 50, {
        filter: 'userid = "' + userStore.user.id + '"',
      });

      const ccares = await pb?.collection('cca').getList(1, 500, {
        filter: 'id="' + udres?.items[0].ccaId + '"',
      });

      if (ccares?.items[0]) {
        userStore.cca = ccares?.items[0]
      }

      router.push('/')
    }
  }
  catch (err) {
    // TODO: toast
    console.log(err)
  }
}
</script>

<template>
  <ACard v-motion-pop title="ABS" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="login">
      <AInput v-model="username" placeholder=" Username" type="text" prepend-inner-icon="i-bx-user" class="text-sm" />
      <AInput v-model="password" placeholder="Password" type="password" prepend-inner-icon="i-bx-lock" class="text-sm" />
      <ABtn>Login</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>

<style scoped></style>
