import type { VideoBlock } from '@/components/admin/builder/types'

interface VideoBlockProps {
  block: VideoBlock
}

export function VideoBlockComponent({ block }: VideoBlockProps) {
  const getEmbedUrl = (url: string) => {
    // YouTube URL conversion
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Vimeo URL conversion
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }

    // Return original URL if it's already an embed URL
    return url
  }

  return (
    <div className='my-8'>
      <div className='relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100'>
        <iframe
          src={getEmbedUrl(block.data.url)}
          title='Video content'
          className='w-full h-full'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>
    </div>
  )
}
