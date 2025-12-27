import type { TextBlock } from '@/components/admin/builder/types'

interface TextBlockProps {
  block: TextBlock
}

export function TextBlockComponent({ block }: TextBlockProps) {
  return (
    <div className='prose prose-gray max-w-none'>
      <div
        dangerouslySetInnerHTML={{ __html: block.data.content }}
        className='text-gray-800 leading-relaxed'
      />
    </div>
  )
}
