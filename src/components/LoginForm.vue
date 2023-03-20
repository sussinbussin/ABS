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
const usernameEmpty = ref(true)
const passwordEmpty = ref(true)

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

const usernameEmptyMsg = computed(() => {
  if (username.value && username.value.trim()) {
    usernameEmpty.value = false
    return ''
  }
  else {
    usernameEmpty.value = true
    return 'Username cannot be empty!'
  }
})

const passwordEmptyMsg = computed(() => {
  if (password.value && password.value.trim()) {
    passwordEmpty.value = false
    return ''
  }
  else {
    passwordEmpty.value = true
    return 'Password must not be empty'
  }
})

const login = async () => {
  if (!usernameEmpty.value && !passwordEmpty.value) {
    buttonText.value = 'Logging in...'
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

        const inventoryRes = await pb?.collection('inventory').getFullList(500, {
          filter: `cca.id="${userStore.cca.id}"`,
        })

        userStore.inventory = inventoryRes

        const eventRes = await pb?.collection('events').getFullList(500, {
          filter: `cca.id="${userStore.cca.id}"`,
        })

        userStore.events = eventRes

        router.push('/')
      }
    }
    catch (err) {
      throwError('error', `"${err}"`)
      buttonText.value = 'Login'
      username.value = ''
      password.value = ''
    }
  }
}
</script>

<template>
  <ACard v-motion-pop title="ABS" class="px-5 pb-6">
    <form class="grid-row place-items-stretch" @submit.prevent="login">
      <AInput
        v-model="username" :error="usernameEmptyMsg" placeholder="Username" type="text"
        prepend-inner-icon="i-bx-user" class="text-sm"
      />
      <AInput
        v-model="password" :error="passwordEmptyMsg" placeholder="Password" type="password"
        prepend-inner-icon="i-bx-lock" class="text-sm"
      />
      <ABtn>{{ buttonText }}</ABtn>
    </form>
  </ACard>
</template>

<style scoped></style>
