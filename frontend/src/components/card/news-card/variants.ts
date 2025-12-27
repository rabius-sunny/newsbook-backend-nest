import { cva, VariantProps } from 'class-variance-authority'

export const newsCardVariants = cva(
  'group relative w-full bg-white overflow-clip flex items-center flex-col gap-4',
  {
    variants: {
      variant: {
        default: '',
        compact: 'flex-row gap-2.5 md:gap-5 p-3 pr-0 sm:pr-4',
        compactSimple: 'flex-row gap-2.5 md:gap-5 p-3 pr-0 sm:pr-4 h-auto border-none',
        compactList: 'flex-row gap-2.5 md:gap-5 !p-0 pr-0 sm:pr-4',
        compactDivided: 'flex-row gap-2.5 md:gap-5 !p-0 pr-0 sm:pr-4',
        compactSlim: '',
        compactMinimal: '',

        minimal: 'flex flex-col gap-2.5 md:gap-5 p-3',
        minimalSimple: 'border-none flex-col gap-2.5 md:gap-5 p-3 pr-0 sm:pr-4',
        slim: '',
        slimList: 'item-start!',
        simple: '',
        banner: '',
        featured: 'flex-col lg:flex-row',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const newsImageWrapperVariants = cva('relative aspect-[1.5] overflow-hidden w-full', {
  variants: {
    variant: {
      default: '',
      compact: 'w-1/3',
      compactSimple: 'w-1/3',
      compactList: 'w-[30%] border-r border-gray-200 p-4',
      compactDivided: 'w-[38%] border-r border-gray-200 p-4',
      compactSlim: 'size-full float-end ml-1.5 max-w-2/5 aspect-[1.5] h-auto',
      compactMinimal: 'w-1/3',
      minimalSimple: '',
      minimal: '',
      slim: '',
      slimList: '',
      simple: '',
      banner:
        'size-full after:size-full after:absolute after:bg-gradient after:bg-gradient-to-t after:to-transparent after:from-black/90',
      featured: 'w-full md:w-1/2 bg-red-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const newsDetailsVariants = cva('space-y-1.5 text-gray-800 w-full', {
  variants: {
    variant: {
      default: 'w-full',
      compact: 'w-2/3',
      compactSimple: 'w-2/3',
      compactList: '',
      compactDivided: 'w-[60%]',
      compactSlim: '',
      compactMinimal: '',
      minimalSimple: 'w-full',
      minimal: '',
      slim: '',
      slimList: '',
      simple: '',
      banner: 'absolute bottom-0 w-full p-4 lg:p-6 text-white!',
      featured: 'w-full md:w-1/2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// Explicitly type the `cva` output to match the expected structure
export type newsCardVariants = VariantProps<typeof newsCardVariants>
