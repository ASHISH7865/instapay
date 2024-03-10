'use server';
import prisma from '@/lib/prisma';
import { OnboardingFormValuesType } from '../ZodShemas/onboardingSchema';
import bcrypt from 'bcrypt';

const SALT = 10;

export async function onboardUser(
  userId: string,
  data: OnboardingFormValuesType,
) {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        id: userId,
      },
    });
    if (user) {
      throw new Error('User already onboarded');
    }

    await prisma.userInfo.create({
      data: {
        userId: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        primaryEmailAddresses: data.primaryEmailAddresses,
        city: data.addresses.city,
        country: data.addresses.country,
        state: data.addresses.stateOrProvince,
        postalCode: data.addresses.postalCode,
        gender: data.gender,
        username: data.username,
        phoneNumber: data.phoneNumbers,
      },
    });
    return {
      message: 'User onboarded successfully',
    };
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function getUserInfo(userId: string) {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      return false;
    }
    return true;
  } catch (err: any) {
    throw new Error(err);
  }
}
