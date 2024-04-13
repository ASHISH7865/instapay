'use server'
import prisma from '@/lib/prisma'
import { months } from '../utils'

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
    const data1 = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
      include: {
        wallet: {
          include: {
            transactions: {
              where: {
                trnxType:"CREDIT"
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

    const data2 = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
      include: {
        wallet: {
          include: {
            transactions: {
              where: {
                trnxType:"DEBIT"
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

    // tranform data to the format required by the chart component
    // e.g. [{key: '2021-01-01', value: 1000}, {key: '2021-01-02', value: 2000}]
    const transformedData1 = data1?.wallet?.transactions.map((transaction) => {
      return {
        key:
          transaction.createdAt.getDate() +
          '-' +
          months[transaction.createdAt.getMonth()].short +
          '-' +
          transaction.createdAt.getFullYear(),
        value1: transaction.amount,
      }
    })

    const transformedData2 = data2?.wallet?.transactions.map((transaction) => {
      return {
        key:
          transaction.createdAt.getDate() +
          '-' +
          months[transaction.createdAt.getMonth()].short +
          '-' +
          transaction.createdAt.getFullYear(),
        value2: transaction.amount,
      }
    })

    // merge data beased on key [{key:"2021-01-01", value1: 1000, value2: 2000}]
    const transformedData = transformedData1?.map((data1) => {
      const data2 = transformedData2?.find((data2) => data2.key === data1.key)
      return {
        key: data1.key,
        value1: data1.value1,
        value2: data2?.value2,
      }
    })
      

    return {
      totalBalanceChartData: transformedData,
    }
  } catch (error) {
    console.error('Error fetching total balance chart data:', error)
  }
}

export async function getRecentTransactions(userId: string) {
  try {
    const data = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 5,
            },
          },
        },
      },
    })

    return {
      recentTransactions: data?.wallet?.transactions,
    }
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
  }
}


export async function getTotalAmount (userId: string) {
  try {
    const getTotalCreditTransactions = await prisma.wallet.findMany({
      where: {
        userId: userId,
      },
      select: {
        transactions: {
          where: {
            trnxType: "CREDIT"
          },
          select: {
            amount: true
          }
        }
      }
    })

    const getTotalDebitTransactions = await prisma.wallet.findMany({
      where: {
        userId: userId,
      },
      select: {
        transactions: {
          where: {
            trnxType: "DEBIT"
          },
          select: {
            amount: true
          }
        }
      }
    })

    const totalCreditAmount = getTotalCreditTransactions[0].transactions.reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0)

    const totalDebitAmount = getTotalDebitTransactions[0].transactions.reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0) 

    return {
      totalCreditAmount,
      totalDebitAmount
    }

  } catch (error) {
    console.error('Error fetching total amount:', error)
  }
}