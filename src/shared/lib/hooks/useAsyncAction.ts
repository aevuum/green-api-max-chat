import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../errors'

interface AsyncActionState {
  isPending: boolean
  error: string | null
}

const IDLE_STATE: AsyncActionState = { isPending: false, error: null }

export const useAsyncAction = <TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
) => {
  const [state, setState] = useState<AsyncActionState>(IDLE_STATE)
  const actionRef = useRef(action)

  useLayoutEffect(() => {
    actionRef.current = action
  })

  const run = useCallback(async (...args: TArgs): Promise<TResult | undefined> => {
    setState({ isPending: true, error: null })

    try {
      const result = await actionRef.current(...args)
      setState(IDLE_STATE)
      return result
    } catch (error) {
      setState({ isPending: false, error: getErrorMessage(error) })
      return undefined
    }
  }, [])

  const resetError = useCallback(() => {
    setState((current) => (current.error ? { ...current, error: null } : current))
  }, [])

  return { ...state, run, resetError }
}
