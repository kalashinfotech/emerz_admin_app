import type { RefObject } from 'react'

import { Copy, CopyCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

type CopyButtonProps = {
  text?: string
  elementRef?: RefObject<HTMLElement>
}

export const CopyButton = ({ text, elementRef }: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard()

  const handleCopy = () => {
    let copyText = text
    if (!copyText && elementRef?.current) {
      copyText = elementRef.current.innerHTML
    }

    copy(copyText)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4 hover:bg-transparent focus-visible:border-none focus-visible:ring-0"
      onClick={handleCopy}>
      {copied ? <CopyCheck className="text-primary size-3" /> : <Copy className="size-3" />}
    </Button>
  )
}
