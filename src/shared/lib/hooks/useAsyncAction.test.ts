import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useAsyncAction } from './useAsyncAction'

describe('useAsyncAction', () => {
  it('returns the action result and resets the pending state', async () => {
    const { result } = renderHook(() => useAsyncAction(async (value: number) => value * 2))

    let value: number | undefined
    await act(async () => {
      value = await result.current.run(21)
    })

    expect(value).toBe(42)
    expect(result.current.isPending).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('stores a readable error when the action fails', async () => {
    const { result } = renderHook(() =>
      useAsyncAction(async () => {
        throw new Error('Broken')
      }),
    )

    await act(async () => {
      await result.current.run()
    })

    expect(result.current.error).toBe('Broken')

    act(() => result.current.resetError())

    expect(result.current.error).toBeNull()
  })
})
