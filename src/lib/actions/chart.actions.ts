'use server'
import prisma from '@/lib/prisma'

// chart data
// 1. Total wallet balance: A line chart can track the overall balance in the system over time.
// 2 .Distribution of wallet balances: A histogram can show how many wallets fall into different balance ranges (low, medium, high).
// 3 .Currency preference: A pie chart can represent the popularity of different currencies used in the wallets.
// 4.Transaction volume by type (Debit vs Credit): A bar chart can visually compare the frequency of debit and credit transactions.
// 5.Transaction volume by purpose (Deposit, Transfer, Withdrawal): Another bar chart can show the breakdown of transactions based on their purpose.
// 6.Transaction success rate: A pie chart can represent the percentage of completed transactions compared to failed ones.
// 7.Average transaction amount: A line chart can track the average transaction amount over time.

// a line chart data that tracks the overall balance in the system over time.
export async function getTotalBalanceChartData(userId: string) {
  try {
    const data = await prisma.userInfo.findUnique({
      where: {
        id: userId,
      },
      include: {
        wallet: {
          include: {
            transactions: {
              where: {
                purpose: 'DEPOSIT',
              },
              select: {
                amount: true,
                createdAt: true,
              },
            },
          },
        },
      },
    })

    return {
      totalBalanceChartData: data?.wallet?.transactions,
    }
  } catch (error) {
    return {
      totalBalanceChartData: [],
    }
  }
}
