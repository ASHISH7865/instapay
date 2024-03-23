'use server'
import prisma from '@/lib/prisma'

export interface IUserInfo {
  email: string
  userId: string
  username: string
}

export interface User {
  id: string
  userId: string
  email: string
  username: string
  setupCompleted: boolean
  balance: number
}

export async function updateUserOnboardingStatus(userId: string) {
  try {
    // Update user info to set setupCompleted to true
    // 1. Find user info by userId and check if it exists
    const user = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
    })
    if (!user) {
      return {
        message: 'User info not found',
      }
    }
    // 2. Update user info to set setupCompleted to true
    const updatedUser = await prisma.userInfo.update({
      where: {
        userId: userId,
      },
      data: {
        setupCompleted: true,
      },
    })
    return {
      message: 'User onboarding process completed successfully',
      user: updatedUser,
    }
  } catch (error) {
    throw new Error('Error getting user onboarding status')
  }
}

export async function checkUserExists(userId: string) {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
    })
    if (user) {
      return {
        userExists: true,
        user: user,
      }
    } else {
      return {
        userExists: false,
        user: null,
      }
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error checking if user exists')
  }
}

export async function checkUserExistsByEmail(email: string) {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        primaryEmailAddresses: email,
      },
    })
    if (user) {
      return {
        userExists: true,
        user: user,
      }
    } else {
      return {
        userExists: false,
        user: null,
      }
    }
  } catch (error) {
    console.log(error)
    throw new Error('Error checking if user exists')
  }
}

export async function getAllUserInfo() {
  try {
    const users = await prisma.userInfo.findMany()
    return {
      message: 'Users fetched successfully',
      data: users,
    }
  } catch (error) {
    throw new Error('Error fetching users')
  }
}


export async function getUserInfoById(userId: string) {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
    })
    if (user) {
      return {
        message: 'User fetched successfully',
        data: user,
      }
    }
    return {
      message: 'User not found',
      data: null,
    }
}
  catch (error) {
    throw new Error('Error fetching user')
  }
}