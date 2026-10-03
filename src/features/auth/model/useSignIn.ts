import { useSessionStore } from '@/entities/session'
import { GreenApiClient, type GreenApiCredentials, type InstanceState } from '@/shared/api'
import { useAsyncAction } from '@/shared/lib/hooks'

const INSTANCE_STATE_HINTS: Partial<Record<InstanceState, string>> = {
  notAuthorized: 'аккаунт MAX не авторизован — подключите его в личном кабинете GREEN-API',
  blocked: 'аккаунт заблокирован',
  sleepMode: 'аккаунт в спящем режиме — откройте MAX на телефоне',
  starting: 'инстанс запускается, попробуйте через минуту',
  yellowCard: 'отправка сообщений временно ограничена',
}

export const useSignIn = () => {
  const signIn = useSessionStore((state) => state.signIn)

  return useAsyncAction(async (credentials: GreenApiCredentials) => {
    const client = new GreenApiClient(credentials)
    const { stateInstance } = await client.getStateInstance()

    if (stateInstance !== 'authorized') {
      const hint = INSTANCE_STATE_HINTS[stateInstance] ?? `статус «${stateInstance}»`
      throw new Error(`Инстанс недоступен: ${hint}`)
    }

    signIn(credentials)
  })
}
