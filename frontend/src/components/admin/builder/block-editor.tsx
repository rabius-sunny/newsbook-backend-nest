'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import { Image, ImageIcon, Megaphone, Plus, Quote, Type, Video } from 'lucide-react'
import dynamic from 'next/dynamic'
import { BannerBlockEditor } from './blocks/banner-block-editor'
import { ImageBlockEditor } from './blocks/image-block-editor'
import { ImageWithTextBlockEditor } from './blocks/image-with-text-block-editor'
import { QuoteBlockEditor } from './blocks/quote-block-editor'
import { VideoBlockEditor } from './blocks/video-block-editor'
import type { BlockType, ContentBlock } from './types'

const TextBlockEditor = dynamic(
  () => import('./blocks/text-block-editor').then((mod) => ({ default: mod.TextBlockEditor })),
  {
    ssr: false
  }
)

interface BlockEditorProps {
  className?: string
}

const blockTypeConfig = {
  text: {
    icon: Type,
    label: 'Text',
    description: 'Add rich text content'
  },
  quote: {
    icon: Quote,
    label: 'Quote',
    description: 'Add a blockquote with attribution'
  },
  image: {
    icon: Image,
    label: 'Image',
    description: 'Upload or select an image'
  },
  video: {
    icon: Video,
    label: 'Video',
    description: 'Embed video from YouTube, Vimeo, etc.'
  },
  imageWithText: {
    icon: ImageIcon,
    label: 'Image + Text',
    description: 'Image alongside text content'
  },
  banner: {
    icon: Megaphone,
    label: 'Banner',
    description: 'Full-width promotional banner'
  }
  // relatedNews: {
  //   icon: Newspaper,
  //   label: 'Related News',
  //   description: 'Link to related articles'
  // }
} as const

export function BlockEditor({ className = '' }: BlockEditorProps) {
  const { blocks, addBlock } = useBlockEditorStore()

  const handleAddBlock = (type: BlockType) => {
    addBlock(type)
  }

  const renderBlock = (block: ContentBlock, index: number) => {
    const isFirst = index === 0
    const isLast = index === blocks.length - 1

    switch (block.type) {
      case 'text':
        return <TextBlockEditor key={block.id} block={block} isFirst={isFirst} isLast={isLast} />

      case 'quote':
        return <QuoteBlockEditor key={block.id} block={block} isFirst={isFirst} isLast={isLast} />

      case 'image':
        return <ImageBlockEditor key={block.id} block={block} isFirst={isFirst} isLast={isLast} />

      case 'video':
        return <VideoBlockEditor key={block.id} block={block} isFirst={isFirst} isLast={isLast} />

      case 'imageWithText':
        return (
          <ImageWithTextBlockEditor
            key={block.id}
            block={block}
            isFirst={isFirst}
            isLast={isLast}
          />
        )

      case 'banner':
        return <BannerBlockEditor key={block.id} block={block} isFirst={isFirst} isLast={isLast} />

      case 'relatedNews':
        return (
          <div key={block.id} className='p-4 border rounded bg-muted'>
            <p className='text-center text-muted-foreground'>Related News Block (Coming Soon)</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Block List */}
      {blocks.map((block: any, index: number) => renderBlock(block, index))}

      {/* Add Block Button */}
      <div className='flex justify-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='h-12 px-6'>
              <Plus className='mr-2 h-4 w-4' />
              Add Block
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='center' className='w-64'>
            {Object.entries(blockTypeConfig).map(([type, config]) => {
              const Icon = config.icon
              return (
                <DropdownMenuItem
                  key={type}
                  onClick={() => handleAddBlock(type as BlockType)}
                  className='flex items-start gap-3 p-3 cursor-pointer'
                >
                  <Icon className='h-5 w-5 mt-0.5 text-muted-foreground' />
                  <div>
                    <div className='font-medium'>{config.label}</div>
                    <div className='text-sm text-muted-foreground'>{config.description}</div>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className='text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg'>
          <div className='space-y-3'>
            <div className='mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
              <Plus className='h-6 w-6 text-muted-foreground' />
            </div>
            <div>
              <h3 className='text-lg font-medium'>Start building your article</h3>
              <p className='text-muted-foreground'>Add your first content block to get started</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
