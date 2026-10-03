import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/shared/ui'
import { SendIcon } from '@/shared/ui/icons'
import { useSendMessage } from '../model/useSendMessage'
import styles from './MessageComposer.module.css'

const MAX_TEXTAREA_HEIGHT = 160

interface MessageComposerProps {
  chatId: string
}

export const MessageComposer = ({ chatId }: MessageComposerProps) => {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sendMessage = useSendMessage(chatId)
  const trimmedText = text.trim()

  useLayoutEffect(() => {
    const textarea = textareaRef.current

    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
    }
  }, [text])

  const submit = () => {
    if (!trimmedText) {
      return
    }

    void sendMessage(trimmedText)
    setText('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        rows={1}
        placeholder="Сообщение"
        aria-label="Текст сообщения"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Button
        type="submit"
        isIcon
        disabled={!trimmedText}
        aria-label="Отправить"
        title="Отправить"
        className={styles.send}
      >
        <SendIcon />
      </Button>
    </form>
  )
}
