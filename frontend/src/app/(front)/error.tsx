'use client'

import { Container } from '@/components/common/container'
import MotionAlert from '@/components/common/MotionAlert'
import { Section } from '@/components/common/section'

export default function error({ error }: { error: any }) {
  return (
    <Section>
      <Container>
        <div className='flex justify-center items-center mx-auto max-w-2xl min-h-[500px]'>
          <MotionAlert
            message='Error'
            description={error?.message || 'Something went wrong'}
            type='error'
            showIcon
            className='m-4'
          />
        </div>
      </Container>
    </Section>
  )
}
