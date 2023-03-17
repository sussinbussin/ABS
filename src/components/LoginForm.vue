<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useToast } from 'vue-toast-notification'

const router = useRouter()

const toast = useToast();

const pb = inject(pbSymbol)

const username = ref('')
const password = ref('')

//TODO: add spinner
const buttonText = ref('Login')

const userStore = useUserStore()


//delete all credentials when visiting login.
onMounted(() => {
  userStore.clear()
  localStorage.removeItem("pocketbase_auth")
})

const throwError = (message: string) => {
  toast.open({
    type: "error",
    message: message,
    position: "bottom"
  })

}
const login = async () => {
  buttonText.value = "Logging in.."
  try {
    const res = await pb?.collection('users').authWithPassword(username.value, password.value)

    //TODO: add password wrong
    if (res.record) {
      buttonText.value = "Logged In! Retreving Data.."

      userStore.user = res.record

      // get rest of the details
      const udRes = await pb?.collection('userDetails').getList(1, 50, {
        filter: `userid = "${userStore.user.id}"`,
      })
      //TODO: wrong implementation of api
      const ccaRes = await pb?.collection('cca').getList(1, 500, {
        filter: `id="${udRes?.items[0].ccaId}"`,
      })
      if (ccaRes?.items[0])
        userStore.cca = ccaRes?.items[0]

      const inventoryRes = await pb?.collection('inventory').getFullList(500, {
        filter: `cca.id="${userStore.cca.id}"`,
      })

      userStore.inventory = inventoryRes

      router.push('/')
    }
  }
  catch (err) {
    throwError("Invalid username or password")
    buttonText.value = "Login"
    username.value = ""
    password.value = ""
  }
}
</script>

<template>
  <ACard v-motion-pop title="ABS" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="login">
      <AInput v-model="username" placeholder="Username" type="text" prepend-inner-icon="i-bx-user" class="text-sm" />
      <AInput v-model="password" placeholder="Password" type="password" prepend-inner-icon="i-bx-lock" class="text-sm" />
      <ABtn>{{ buttonText }}</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>

<style scoped></style>
