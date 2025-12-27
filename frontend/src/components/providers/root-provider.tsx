import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'
import { ThemeProvider } from './theme-provider'

interface RootProvidersProps {
  children: React.ReactNode
}

const RootProviders: React.FC<RootProvidersProps> = ({ children }) => (
  <ThemeProvider defaultTheme='light' enableSystem disableTransitionOnChange>
    <NuqsAdapter>{children}</NuqsAdapter>
    <Toaster richColors closeButton theme='light' position='bottom-right' />
  </ThemeProvider>
)

export default RootProviders
