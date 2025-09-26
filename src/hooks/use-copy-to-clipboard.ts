import { useState } from 'react'

import { toast } from 'sonner'

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false)

  const copy = async (text?: string) => {
    if (!text) {
      console.error('Nothing to copy: text is undefined')
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success(`${text}`)
    } catch (err) {
      toast.error(`Failed to copy text: ${text}`)
      console.error('Copy failed:', err)
    }
  }

  return { copied, copy }
}
