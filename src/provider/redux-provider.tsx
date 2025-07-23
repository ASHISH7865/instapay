'use client'

import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store/store'

interface ReduxProviderProps {
    children: React.ReactNode
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
    const store = makeStore()

    return <Provider store={store}>{children}</Provider>
}
