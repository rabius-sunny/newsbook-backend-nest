import type { ContentBlock } from '@/components/admin/builder/types'
import { BannerBlockComponent } from './banner-block'
import { ImageBlockComponent } from './image-block'
import { ImageWithTextBlockComponent } from './image-with-text-block'
import { QuoteBlockComponent } from './quote-block'
import { RelatedNewsBlockComponent } from './related-news-block'
import { TextBlockComponent } from './text-block'
import { VideoBlockComponent } from './video-block'

interface BlockRendererProps {
  block: ContentBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'text':
      return <TextBlockComponent block={block} />

    case 'quote':
      return <QuoteBlockComponent block={block} />

    case 'image':
      return <ImageBlockComponent block={block} />

    case 'video':
      return <VideoBlockComponent block={block} />

    case 'imageWithText':
      return <ImageWithTextBlockComponent block={block} />

    case 'banner':
      return <BannerBlockComponent block={block} />

    case 'relatedNews':
      return <RelatedNewsBlockComponent block={block} />

    default:
      console.warn('Unknown block type:', (block as any).type)
      return null
  }
}
