import CustomLink from '@/components/common/CustomLink'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { use } from 'react'

export default function CategoryNav({ promise }: { promise: any }) {
  const data: any = use(promise)

  if (!data?.data?.categories?.length) return null
  return (
    <Section variant='none' className='top-0 z-10 sticky bg-gray-50 shadow'>
      <Container>
        <nav>
          <div className='flex items-center gap-2 overflow-x-auto'>
            {data?.data?.categories?.map((item: Category, idx: number) => (
              <CustomLink
                key={idx}
                href={`/categories/${item?.slug}`}
                className='font-semibold text-gray-800 hover:text-primary whitespace-nowrap'
              >
                <span className='block px-1.5 lg:px-3 py-3'>{item?.name}</span>
              </CustomLink>
            ))}
          </div>
        </nav>
      </Container>
    </Section>
  )
}
