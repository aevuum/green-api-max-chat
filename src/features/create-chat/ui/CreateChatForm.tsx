import { useState, type FormEvent } from 'react'
import { Button, Input } from '@/shared/ui'
import { PlusIcon } from '@/shared/ui/icons'
import { useCreateChat } from '../model/useCreateChat'
import styles from './CreateChatForm.module.css'

export const CreateChatForm = () => {
  const [phone, setPhone] = useState('')
  const { run: createChat, isPending, error, resetError } = useCreateChat()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!phone.trim()) {
      return
    }

    const createdChatId = await createChat(phone)

    if (createdChatId) {
      setPhone('')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <Input
          className={styles.input}
          type="tel"
          inputMode="tel"
          placeholder="Номер получателя"
          aria-label="Номер телефона получателя"
          value={phone}
          error={error ?? undefined}
          onChange={(event) => {
            setPhone(event.target.value)
            resetError()
          }}
        />
        <Button
          type="submit"
          variant="secondary"
          isIcon
          isLoading={isPending}
          disabled={!phone.trim()}
          title="Новый чат"
          aria-label="Создать чат"
          className={styles.submit}
        >
          <PlusIcon />
        </Button>
      </div>
    </form>
  )
}
