import { NewsCard } from '@/components/card/news-card'
import { NewsCardSkeleton } from '@/components/card/news-card/skeleton'
import SectionHeader from '@/components/common/section-header'
import { generateGridCols } from '@/i18n/generateGridCols'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

const newsGridVariants = cva('w-full', {
  variants: {
    variant: {
      'hero-sidebar': 'grid', // cols handled dynamically
      'featured-grid': 'grid',
      'slim-grid': 'grid',
      'compact-list': 'flex flex-col space-y-4', // list mode, no grid
      'card-grid': 'grid',
      magazine: 'grid',
      'mixed-entertainment': 'grid',
      'mixed-lifestyle': 'grid',
      'mixed-photo': 'grid',
      asymmetric: 'grid'
    },
    spacing: {
      tight: 'gap-2',
      normal: 'gap-4',
      loose: 'gap-4 md:gap-6',
      extra: 'gap-5 md:gap-8'
    }
  },
  defaultVariants: {
    variant: 'hero-sidebar',
    spacing: 'normal'
  }
})

const newsItemVariants = cva('group cursor-pointer', {
  variants: {
    layout: {
      hero: 'lg:col-span-2',
      featured: 'space-y-3',
      compact: 'flex gap-3 items-start',
      card: 'bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow',
      sidebar: 'space-y-3',
      'compact-vertical': 'space-y-2',
      'featured-large': 'lg:col-span-3 space-y-4',
      'featured-medium': 'lg:col-span-2 space-y-3',
      'featured-small': 'space-y-2',
      'video-large': 'lg:col-span-3 space-y-4 relative',
      'video-small': 'lg:col-span-1 space-y-2 relative'
    },
    // imageSize: {
    //   large: '[&_.News-image]:aspect-video',
    //   medium: '[&_.News-image]:aspect-[4/3]',
    //   small: '[&_.News-image]:w-16 [&_.News-image]:h-12',
    //   thumbnail: '[&_.News-image]:w-20 [&_.News-image]:h-16',
    //   'extra-large': '[&_.News-image]:aspect-[16/10]',
    //   square: '[&_.News-image]:aspect-square',
    //   portrait: '[&_.News-image]:aspect-[3/4]'
    // },
    colSpan: {
      1: 'lg:col-span-1',
      2: 'lg:col-span-2',
      3: 'lg:col-span-3',
      4: 'lg:col-span-4',
      5: 'lg:col-span-5',
      6: 'lg:col-span-6'
    }
  },
  defaultVariants: {
    layout: 'featured',
    colSpan: 1
  }
})

interface NewsGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof newsGridVariants> {
  items?: News[]
  itemLayout?: NewsCardVariant
  gridCol?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  loading?: boolean | number
  title?: any
}

function NewsGrid({
  className,
  variant,
  spacing,
  items,
  itemLayout = 'default',
  gridCol = 2,
  loading = false,
  ...props
}: NewsGridProps) {
  function resolveVariant(
    variant: NewsGridProps['variant'],
    index: number,
    itemLayout: NewsCardVariant
  ): NewsCardVariant {
    if (index === 0) {
      if (variant === 'hero-sidebar') return 'banner'
      if (variant === 'mixed-entertainment') return 'default'
      if (variant === 'mixed-photo') return 'banner'
    }
    return itemLayout
  }

  // Use skeleton placeholders when loading, else use items
  const renderItems = loading
    ? Array.from({ length: (typeof loading === 'number' && loading) || 5 }) // placeholder count (configurable)
    : items ?? []

  return (
    <div className='space-y-4'>
      {props.title && <SectionHeader title={props.title} />}
      <div
        className={cn(
          generateGridCols(gridCol),
          newsGridVariants({ variant, spacing, className }),
          className
        )}
        {...props}
      >
        {renderItems.map((item, index) =>
          loading ? (
            <NewsCardSkeleton
              key={index}
              variant={resolveVariant(variant, index, itemLayout)}
              className={cn({
                'col-span-2':
                  variant !== 'mixed-lifestyle' && variant === 'hero-sidebar' && index === 0
              })}
            />
          ) : (
            <NewsCard
              key={index}
              data={item as News}
              variant={resolveVariant(variant, index, itemLayout)}
              className={cn({
                'col-span-2':
                  variant !== 'mixed-lifestyle' && variant === 'hero-sidebar' && index === 0
              })}
            />
          )
        )}
      </div>
    </div>
  )
}

// interface NewsItemProps {
//   item: News | any
//   layout?: VariantProps<typeof NewsItemVariants>['layout']
//   colSpan?: VariantProps<typeof NewsItemVariants>['colSpan']
// }

// function NewsItem({ item, layout = 'featured', colSpan = 1 }: NewsItemProps) {
//   const isCompact = layout === 'compact'
//   const isCard = layout === 'card'
//   const hasVideo = item?.hasVideo || layout?.includes('video')

//   return (
//     <article
//       className={cn(
//         NewsItemVariants({ layout, colSpan: colSpan || item?.colSpan }),
//         item?.colSpan && `lg:col-span-${item?.colSpan}`
//       )}
//     >
//       {item?.featuredImage && (
//         <div
//           className={cn(
//             'relative flex-shrink-0 rounded-lg overflow-hidden News-image',
//             isCompact && 'order-2',
//             hasVideo && 'group'
//           )}
//         >
//           <CustomImage
//             src={item?.featuredImage || '/placeholder.svg'}
//             alt={item?.title}
//             fill={!isCompact}
//             width={isCompact ? 80 : undefined}
//             height={isCompact ? 64 : undefined}
//             className='object-cover group-hover:scale-105 transition-transform duration-300'
//           />

//           {hasVideo && (
//             <div className='absolute inset-0 flex justify-center items-center bg-black/20'>
//               <div className='flex items-center gap-2 text-white'>
//                 <button className='flex justify-center items-center bg-black/50 hover:bg-black/70 rounded-full w-8 h-8 transition-colors'>
//                   <svg className='ml-0.5 w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
//                     <path d='M8 5v14l11-7z' />
//                   </svg>
//                 </button>
//                 {item?.videoControls && (
//                   <>
//                     <button className='flex justify-center items-center bg-black/50 hover:bg-black/70 rounded w-6 h-6 transition-colors'>
//                       <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
//                         <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
//                       </svg>
//                     </button>
//                     <button className='flex justify-center items-center bg-black/50 hover:bg-black/70 rounded w-6 h-6 transition-colors'>
//                       <svg className='ml-0.5 w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
//                         <path d='M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z' />
//                       </svg>
//                     </button>
//                   </>
//                 )}
//               </div>
//               {item?.videoControls && (
//                 <div className='top-2 left-2 absolute bg-black/70 px-2 py-1 rounded text-white text-xs'>
//                   ২/১০
//                 </div>
//               )}
//             </div>
//           )}

//           {item?.hasVideo && (
//             <div className='top-2 right-2 absolute'>
//               <div className='flex items-center gap-1 bg-red-600 px-1.5 py-0.5 rounded text-white text-xs'>
//                 <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'>
//                   <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
//                 </svg>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       <div className={cn('space-y-2', isCompact && 'flex-1')}>
//         {item?.category && (
//           <span className='font-medium text-blue-600 text-xs uppercase tracking-wide'>
//             {item?.category?.title}
//           </span>
//         )}

//         <h3
//           className={cn(
//             'font-semibold group-hover:text-blue-600 leading-tight transition-colors',
//             layout === 'hero'
//               ? 'text-2xl lg:text-3xl text-gray-900'
//               : layout === 'featured-large'
//               ? 'text-xl lg:text-2xl text-gray-900'
//               : layout === 'video-large'
//               ? 'text-xl lg:text-2xl text-gray-900'
//               : isCard
//               ? 'text-lg'
//               : 'text-base text-gray-900',
//             item?.isHighlighted && 'text-primary'
//           )}
//         >
//           {item?.title}
//         </h3>

//         {item?.excerpt && (
//           <p
//             className={cn(
//               'text-gray-600 leading-relaxed',
//               layout === 'hero' || layout === 'featured-large' || layout === 'video-large'
//                 ? 'text-base'
//                 : 'text-sm'
//             )}
//           >
//             {item?.excerpt}
//           </p>
//         )}

//         <p className='text-gray-500 text-xs'>{item?.timestamp}</p>
//       </div>
//     </article>
//   )
// }

export { NewsGrid, newsGridVariants, newsItemVariants }
export type { NewsGridProps }
