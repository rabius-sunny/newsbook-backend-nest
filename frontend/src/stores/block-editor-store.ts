'use client'

import type {
  ArticleContent,
  BannerBlock,
  BlockType,
  ContentBlock,
  ImageBlock,
  ImageWithTextBlock,
  QuoteBlock,
  RelatedNewsBlock,
  TextBlock,
  VideoBlock,
} from '@/components/admin/builder/types'
import { generateRandomString } from '@/components/admin/builder/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BlockEditorState {
  blocks: ContentBlock[]
  sessionId: string

  // Actions
  setBlocks: (blocks: ContentBlock[]) => void
  addBlock: (type: BlockType, data?: any) => void
  updateBlock: (id: string, updates: Partial<ContentBlock>) => void
  deleteBlock: (id: string) => void
  reorderBlocks: (fromIndex: number, toIndex: number) => void
  moveBlockUp: (id: string) => void
  moveBlockDown: (id: string) => void
  duplicateBlock: (id: string) => void
  clearBlocks: () => void
  loadInitialContent: (content?: ArticleContent) => void
  getContent: () => ArticleContent
  createNewSession: () => void
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
          content: data?.content || '',
        },
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
          designation: data?.designation || '',
        },
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
          height: data?.height,
        },
      }
      return imageBlock
    }

    case 'video': {
      const videoBlock: VideoBlock = {
        ...baseBlock,
        type: 'video',
        data: {
          url: data?.url || '',
        },
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
          imageHeight: data?.imageHeight,
        },
      }
      return imageWithTextBlock
    }

    case 'banner': {
      const bannerBlock: BannerBlock = {
        ...baseBlock,
        type: 'banner',
        data: {
          imageUrl: data?.imageUrl || '',
          linkUrl: data?.linkUrl || '',
        },
      }
      return bannerBlock
    }

    case 'relatedNews': {
      const relatedNewsBlock: RelatedNewsBlock = {
        ...baseBlock,
        type: 'relatedNews',
        data: {
          title: data?.title || 'Related News',
          articles: data?.articles || [],
        },
      }
      return relatedNewsBlock
    }

    default:
      throw new Error(`Unknown block type: ${type}`)
  }
}

export const useBlockEditorStore = create<BlockEditorState>()(
  persist(
    (set, get) => ({
      blocks: [],
      sessionId: generateRandomString(16),

      setBlocks: (blocks) => {
        set({ blocks })
      },

      addBlock: (type, data) => {
        const state = get()
        const id = generateRandomString(12)
        const newBlock = createBlock(type, id, state.blocks.length, data)

        set({
          blocks: [...state.blocks, newBlock as ContentBlock],
        })
      },

      updateBlock: (id, updates) => {
        const state = get()

        const newBlocks = state.blocks.map((block) => {
          if (block.id === id) {
            // Deep merge for data property to avoid overwriting other data fields
            const updatedBlock = { ...block, ...updates }
            if (updates.data && block.data) {
              updatedBlock.data = { ...block.data, ...updates.data }
            }
            console.log('🎯 Block updated successfully:', {
              blockId: id,
              oldData: block.data,
              newData: updatedBlock.data,
            })
            return updatedBlock as ContentBlock
          }
          return block
        })

        set({ blocks: newBlocks })
      },

      deleteBlock: (id) => {
        const state = get()
        const newBlocks = state.blocks
          .filter((block) => block.id !== id)
          .map((block, index) => ({ ...block, order: index }) as ContentBlock)

        set({ blocks: newBlocks })
      },

      reorderBlocks: (fromIndex, toIndex) => {
        const state = get()
        const newBlocks = [...state.blocks]
        const [movedBlock] = newBlocks.splice(fromIndex, 1)
        newBlocks.splice(toIndex, 0, movedBlock)

        // Update order property
        const reorderedBlocks = newBlocks.map(
          (block, index) =>
            ({
              ...block,
              order: index,
            }) as ContentBlock,
        )

        set({ blocks: reorderedBlocks })
      },

      moveBlockUp: (id) => {
        const state = get()
        const currentIndex = state.blocks.findIndex((block) => block.id === id)
        if (currentIndex > 0) {
          get().reorderBlocks(currentIndex, currentIndex - 1)
        }
      },

      moveBlockDown: (id) => {
        const state = get()
        const currentIndex = state.blocks.findIndex((block) => block.id === id)
        if (currentIndex < state.blocks.length - 1 && currentIndex !== -1) {
          get().reorderBlocks(currentIndex, currentIndex + 1)
        }
      },

      duplicateBlock: (id) => {
        const state = get()
        const blockToDuplicate = state.blocks.find((block) => block.id === id)
        if (blockToDuplicate) {
          const newId = generateRandomString(12)
          const newOrder = state.blocks.length
          const newBlock = createBlock(
            blockToDuplicate.type,
            newId,
            newOrder,
            blockToDuplicate.data,
          )

          set({
            blocks: [...state.blocks, newBlock as ContentBlock],
          })
        }
      },

      clearBlocks: () => {
        set({ blocks: [] })
      },

      loadInitialContent: (content) => {
        if (content?.blocks) {
          set({ blocks: content.blocks })
        }
      },

      getContent: () => {
        const state = get()
        return {
          blocks: state.blocks,
          version: '1.0',
        }
      },

      createNewSession: () => {
        set({
          sessionId: generateRandomString(16),
          blocks: [],
        })
      },
    }),
    {
      name: 'newsbook-block-editor',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    },
  ),
)
