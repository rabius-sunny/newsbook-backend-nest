'use client'

import { Button } from '@/components/ui/button'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useEffect } from 'react'

const EditorContent = dynamic(
  () => import('@tiptap/react').then((mod) => ({ default: mod.EditorContent })),
  { ssr: false }
)

interface RichTextEditorProps {
  content: string
  placeholder?: string
  onChange: (content: string) => void
  className?: string
}

export function RichTextEditor({
  content,
  placeholder = 'Start writing...',
  onChange,
  className = ''
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false // Disable the default link extension from StarterKit
      }),
      Placeholder.configure({
        placeholder
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Color,
      TextStyle
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return <div className='h-32 bg-muted animate-pulse rounded' />
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50'>
        {/* Text Formatting */}
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className='h-8 w-8 p-0'
        >
          <Bold className='h-3 w-3' />
        </Button>

        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className='h-8 w-8 p-0'
        >
          <Italic className='h-3 w-3' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Lists */}
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className='h-8 w-8 p-0'
        >
          <List className='h-3 w-3' />
        </Button>

        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className='h-8 w-8 p-0'
        >
          <ListOrdered className='h-3 w-3' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Text Alignment */}
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className='h-8 w-8 p-0'
        >
          <AlignLeft className='h-3 w-3' />
        </Button>

        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className='h-8 w-8 p-0'
        >
          <AlignCenter className='h-3 w-3' />
        </Button>

        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className='h-8 w-8 p-0'
        >
          <AlignRight className='h-3 w-3' />
        </Button>

        <div className='w-px h-6 bg-border mx-1' />

        {/* Quote */}
        <Button
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size='sm'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className='h-8 w-8 p-0'
        >
          <Quote className='h-3 w-3' />
        </Button>

        {/* Link */}
        <Button
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size='sm'
          onClick={setLink}
          className='h-8 w-8 p-0'
        >
          <LinkIcon className='h-3 w-3' />
        </Button>

        {/* Headings */}
        <select
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
              ? '2'
              : editor.isActive('heading', { level: 3 })
              ? '3'
              : 'p'
          }
          onChange={(e) => {
            const level = e.target.value
            if (level === 'p') {
              editor.chain().focus().setParagraph().run()
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: parseInt(level) as 1 | 2 | 3 })
                .run()
            }
          }}
          className='ml-2 h-8 px-2 text-sm border rounded'
        >
          <option value='p'>Paragraph</option>
          <option value='1'>Heading 1</option>
          <option value='2'>Heading 2</option>
          <option value='3'>Heading 3</option>
        </select>
      </div>

      {/* Editor */}
      <div
        className='min-h-[200px] max-h-[500px] overflow-y-auto cursor-text'
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent
          editor={editor}
          className='p-4 prose prose-sm max-w-none focus-within:outline-none [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:cursor-text [&_p]:my-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1'
        />
      </div>
    </div>
  )
}
