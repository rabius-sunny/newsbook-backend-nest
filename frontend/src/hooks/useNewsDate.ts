import { formatTime } from '@/lib/formatDateTime'
import { useEffect, useState } from 'react'

type DateState = {
  mode: 'created' | 'updated'
  text: string
}

export function useNewsDate(
  news?: { createdAt?: string; updatedAt?: string },
  locale: string = 'en-US',
) {
  const [dateState, setDateState] = useState<DateState | null>(null)

  const createdTime = news?.createdAt ? new Date(news.createdAt).getTime() : null
  const updatedTime = news?.updatedAt ? new Date(news.updatedAt).getTime() : null

  // Can we toggle? (only if both exist and updated is later than created)
  const isToggle = !!(createdTime && updatedTime && updatedTime > createdTime)

  useEffect(() => {
    if (!news?.createdAt) return

    if (isToggle) {
      setDateState({
        mode: 'updated',
        text: formatTime(news.updatedAt as string, locale, true),
      })
    } else {
      setDateState({
        mode: 'created',
        text: formatTime(news.createdAt, locale, true),
      })
    }
  }, [news, locale, createdTime, updatedTime, isToggle])

  const toggleDate = () => {
    if (!dateState || !isToggle || !news?.createdAt || !news?.updatedAt) return

    const newMode: 'created' | 'updated' = dateState.mode === 'updated' ? 'created' : 'updated'
    const newText =
      newMode === 'updated'
        ? formatTime(news.updatedAt, locale, true)
        : formatTime(news.createdAt, locale, true)

    setDateState({ mode: newMode, text: newText })
  }

  return { dateState, toggleDate, isToggle }
}
