import { redirect } from 'next/navigation'

// Provide at least one static param for build-time validation
export async function generateStaticParams() {
  return [{ newsSlug: 'sample-news' }]
}

type TProps = {
  params: Promise<{ newsSlug: string }>
}

// Redirect to the canonical edit URL
export default async function EditNewsRedirect({ params }: TProps) {
  const { newsSlug } = await params
  redirect(`/admin/news/${newsSlug}/edit`)
}
