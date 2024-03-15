'use client'
import type { Wallet } from '@prisma/client'
import React, { createContext, useMemo } from 'react'

interface WalletContextType {
  balance: number | undefined
  setBalance: React.Dispatch<React.SetStateAction<number | undefined>>
  userWallet: Wallet | null
  setUserWallet: React.Dispatch<React.SetStateAction<Wallet | null>>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWalletContext = (): WalletContextType => {
  const context = React.useContext(WalletContext)
  if (context === undefined || context === null) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [balance, setBalance] = React.useState<number | undefined>(undefined)
  const [userWallet, setUserWallet] = React.useState<Wallet | null>(null)

  const contextValues = useMemo(
    () => ({
      balance,
      setBalance,
      userWallet,
      setUserWallet,
    }),
    [balance, setBalance, userWallet, setUserWallet],
  )

  return <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>
}
