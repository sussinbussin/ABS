<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'

const router = useRouter()

const toast = useToast()

const pb = inject(pbSymbol)

const username = ref('')
const password = ref('')
const usernameErrMsg = ref('')
const passwordErrMsg = ref('')

// TODO: add spinner
const buttonText = ref('Login')

const userStore = useUserStore()

// delete all credentials when visiting login.
onMounted(() => {
  userStore.clear()
  localStorage.removeItem('pocketbase_auth')
})

const throwError = (type: string, message: string) => {
  toast.open({
    type,
    message,
    position: 'bottom',
  })
}

const login = async () => {
  passwordErrMsg.value = ''
  usernameErrMsg.value = ''
  buttonText.value = 'Logging in...'

  let error = false
  // form validation
  if (username.value === '') {
    usernameErrMsg.value = 'Username should not be empty'
    error = true
  }

  if (password.value === '') {
    passwordErrMsg.value = 'Password should not be empty'
    error = true
  }

  if (error) {
    buttonText.value = 'Login'
    return
  }

  try {
    const res = await pb?.collection('users').authWithPassword(username.value, password.value)

    // TODO: add password wrong
    if (res.record) {
      buttonText.value = 'Logged In! Retreving Data..'

      userStore.user = res.record

      // get rest of the details
      const udRes = await pb?.collection('userDetails').getList(1, 50, {
        filter: `userid = "${userStore.user.id}"`,
      })
      // TODO: wrong implementation of api
      const ccaRes = await pb?.collection('cca').getList(1, 500, {
        filter: `id="${udRes?.items[0].ccaId}"`,
      })
      if (ccaRes?.items[0])
        userStore.cca = ccaRes?.items[0]

      const inventoryRes = await pb?.collection('assets').getFullList(500, {
        filter: `club="${userStore.cca.name}"`,
      })

      userStore.inventory = inventoryRes

      // const eventRes = await pb?.collection('events').getFullList(500, {
      //   filter: `cca.id="${userStore.cca.id}"`,
      // })
      //
      // userStore.events = eventRes

      router.push('/')
    }
  }
  catch (err) {
    throwError('error', `"${err}"`)
    buttonText.value = 'Login'
    username.value = ''
    password.value = ''

    passwordErrMsg.value = 'Invalid Password!'
    usernameErrMsg.value = 'Invalid Username!'
  }
}
</script>

<template>
  <ACard v-motion-pop title="ABS" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="login">
      <AInput
        v-model="username" :error="usernameErrMsg" placeholder="Username" type="text" prepend-inner-icon="i-bx-user"
        class="text-sm"
      />
      <AInput
        v-model="password" :error="passwordErrMsg" placeholder="Password" type="password"
        prepend-inner-icon="i-bx-lock" class="text-sm"
      />
      <ABtn>{{ buttonText }}</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
