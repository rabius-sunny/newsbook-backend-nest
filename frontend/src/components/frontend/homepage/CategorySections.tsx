import { use } from 'react'
import NewsSection from '../news-section'

type TProps = {
  categoriesPromise: Promise<{ data: Category[] | null; error: string | null }>
}

export default function CategorySections({ categoriesPromise }: TProps) {
  const result = use(categoriesPromise)

  if (result.error || !result.data || !Array.isArray(result.data)) {
    return null
  }

  return result.data.map((category: Category, idx: number) => (
    <NewsSection data={category} key={idx} sectionIndex={idx + 1} />
  ))
}
