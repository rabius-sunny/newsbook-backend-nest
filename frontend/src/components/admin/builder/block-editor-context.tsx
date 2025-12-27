'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import type {
  ArticleContent,
  BannerBlock,
  BlockEditorContextType,
  BlockType,
  ContentBlock,
  ImageBlock,
  ImageWithTextBlock,
  QuoteBlock,
  RelatedNewsBlock,
  TextBlock,
  VideoBlock
} from './types'
import { generateRandomString } from './types'

const BlockEditorContext = createContext<BlockEditorContextType | null>(null)

interface BlockEditorProviderProps {
  children: ReactNode
  initialContent?: ArticleContent
  onChange?: (content: ArticleContent) => void
}

export function BlockEditorProvider({
  children,
  initialContent,
  onChange
}: BlockEditorProviderProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent?.blocks || [])

  // Update parent when blocks change
  const updateBlocks = useCallback(
    (newBlocks: ContentBlock[]) => {
      setBlocks(newBlocks)
      onChange?.({
        blocks: newBlocks,
        version: '1.0'
      })
    },
    [onChange]
  )

  // Add a new block
  const addBlock = useCallback(
    (type: BlockType, data?: any) => {
      const id = generateRandomString(12)
      const newBlock = createBlock(type, id, blocks.length, data)

      const newBlocks = blocks.concat([newBlock as ContentBlock])
      updateBlocks(newBlocks)
    },
    [blocks, updateBlocks]
  )

  // Update an existing block
  const updateBlock = useCallback(
    (id: string, updates: Partial<ContentBlock>) => {
      console.log('updateBlock called:', { id, updates, currentBlocks: blocks })

      const newBlocks = blocks.map((block) => {
        if (block.id === id) {
          // Deep merge for data property to avoid overwriting other data fields
          const updatedBlock = { ...block, ...updates }
          if (updates.data && block.data) {
            updatedBlock.data = { ...block.data, ...updates.data }
          }
          console.log('Block updated:', { oldBlock: block, newBlock: updatedBlock })
          return updatedBlock as ContentBlock
        }
        return block
      })

      console.log('New blocks array:', newBlocks)
      updateBlocks(newBlocks)
    },
    [blocks, updateBlocks]
  )

  // Delete a block
  const deleteBlock = useCallback(
    (id: string) => {
      const newBlocks = blocks
        .filter((block) => block.id !== id)
        .map((block, index) => ({ ...block, order: index } as ContentBlock))
      updateBlocks(newBlocks)
    },
    [blocks, updateBlocks]
  )

  // Reorder blocks by dragging
  const reorderBlocks = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newBlocks = [...blocks]
      const [movedBlock] = newBlocks.splice(fromIndex, 1)
      newBlocks.splice(toIndex, 0, movedBlock)

      // Update order property
      const reorderedBlocks = newBlocks.map(
        (block, index) =>
          ({
            ...block,
            order: index
          } as ContentBlock)
      )

      updateBlocks(reorderedBlocks)
    },
    [blocks, updateBlocks]
  )

  // Move block up
  const moveBlockUp = useCallback(
    (id: string) => {
      const currentIndex = blocks.findIndex((block) => block.id === id)
      if (currentIndex > 0) {
        reorderBlocks(currentIndex, currentIndex - 1)
      }
    },
    [blocks, reorderBlocks]
  )

  // Move block down
  const moveBlockDown = useCallback(
    (id: string) => {
      const currentIndex = blocks.findIndex((block) => block.id === id)
      if (currentIndex < blocks.length - 1 && currentIndex !== -1) {
        reorderBlocks(currentIndex, currentIndex + 1)
      }
    },
    [blocks, reorderBlocks]
  )

  // Duplicate a block
  const duplicateBlock = useCallback(
    (id: string) => {
      const blockToDuplicate = blocks.find((block) => block.id === id)
      if (blockToDuplicate) {
        const newId = generateRandomString(12)
        const newOrder = blocks.length
        const newBlock = createBlock(blockToDuplicate.type, newId, newOrder, blockToDuplicate.data)

        const newBlocks = blocks.concat([newBlock as ContentBlock])
        updateBlocks(newBlocks)
      }
    },
    [blocks, updateBlocks]
  )

  const value: BlockEditorContextType = {
    blocks,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    moveBlockUp,
    moveBlockDown,
    duplicateBlock
  }

  return <BlockEditorContext.Provider value={value}>{children}</BlockEditorContext.Provider>
}

// Hook to use the block editor context
export function useBlockEditor() {
  const context = useContext(BlockEditorContext)
  if (!context) {
    throw new Error('useBlockEditor must be used within a BlockEditorProvider')
  }
  return context
}

// Helper function to create a properly typed block
function createBlock(type: BlockType, id: string, order: number, data?: any): ContentBlock {
  const baseBlock = { id, order }

  switch (type) {
    case 'text': {
      const textBlock: TextBlock = {
        ...baseBlock,
        type: 'text',
        data: {
          content: data?.content || ''
        }
      }
      return textBlock
    }

    case 'quote': {
      const quoteBlock: QuoteBlock = {
        ...baseBlock,
        type: 'quote',
        data: {
          text: data?.text || data?.content || '',
          author: data?.author || '',
          designation: data?.designation || ''
        }
      }
      return quoteBlock
    }

    case 'image': {
      const imageBlock: ImageBlock = {
        ...baseBlock,
        type: 'image',
        data: {
          imageUrl: data?.imageUrl || data?.url || '',
          alt: data?.alt || '',
          caption: data?.caption || '',
          width: data?.width,
          height: data?.height
        }
      }
      return imageBlock
    }

    case 'video': {
      const videoBlock: VideoBlock = {
        ...baseBlock,
        type: 'video',
        data: {
          url: data?.url || ''
        }
      }
      return videoBlock
    }

    case 'imageWithText': {
      const imageWithTextBlock: ImageWithTextBlock = {
        ...baseBlock,
        type: 'imageWithText',
        data: {
          imageUrl: data?.imageUrl || '',
          imagePosition: data?.imagePosition || data?.layout || 'left',
          imageCaption: data?.imageCaption || '',
          content: data?.content || '',
          imageWidth: data?.imageWidth,
          imageHeight: data?.imageHeight
        }
      }
      return imageWithTextBlock
    }

    case 'banner': {
      const bannerBlock: BannerBlock = {
        ...baseBlock,
        type: 'banner',
        data: {
          imageUrl: data?.imageUrl || '',
          linkUrl: data?.linkUrl || data?.buttonUrl || ''
        }
      }
      return bannerBlock
    }

    case 'relatedNews': {
      const relatedNewsBlock: RelatedNewsBlock = {
        ...baseBlock,
        type: 'relatedNews',
        data: {
          title: data?.title || 'Related News',
          articles: data?.articles || []
        }
      }
      return relatedNewsBlock
    }

    default:
      throw new Error(`Unknown block type: ${type}`)
  }
}
