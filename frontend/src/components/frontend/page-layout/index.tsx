import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'

type TProps = {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
}

export default function PageLayout({ children, header, sidebar, footer }: TProps) {
  return (
    <Section>
      <Container className='space-y-12'>
        {header}
        <div className='relative flex md:flex-row flex-col gap-8 w-full h-full'>
          <div className='w-full md:w-3/4 lg:min-h-[calc(100vh-250px)]'>{children}</div>
          <div className='top-4 sticky flex flex-col gap-4 w-full md:w-1/4'>{sidebar}</div>
        </div>
        {footer}
      </Container>
    </Section>
  )
}
