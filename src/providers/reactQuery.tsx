import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient()
    // We can set some defaults here
    // client.setQueryDefaults(['categories'], {
    //   queryFn: () => fetchFunc(),
    // })
    return client
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
