"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface BeneficiaryData {
  id: string;
  email: string;
  userId: string;
  name: string;
}

export async function createBeneficiary({ userId, beneficiaryId }: { userId: string , beneficiaryId: string}) {
  try {
    const user = await prisma.userInfo.findUnique({
      where: {
        userId: beneficiaryId,
      },
    });

    if (!user) {
      return {
        message: "User not found",
      };
    } 

    // now check if beneficiary already exists
    const beneficiaryExists = await prisma.beneficiary.findUnique({
      where: {
        beneficiaryId: beneficiaryId,
      },
    });

    if (beneficiaryExists) {
      return {
        message: "Beneficiary already exists",
      };
    }
    
    const beneficiary = await prisma.beneficiary.create({
      data: {
        beneficiaryId: beneficiaryId,
        email: user.email,
        userId: userId,
        name: user.username,
      },
    });
    revalidatePath("/dashboard/beneficiaries");
    return {
      message: "Beneficiary created successfully",
      data: beneficiary,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error creating beneficiary");
  }
}

export async function getBeneficiariesByUserId(userId: string) {
  try {
    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        userId: userId,
      },
    });
    return {
      message: "Beneficiaries fetched successfully",
      data: beneficiaries,
    };
  } catch (error) {
    throw new Error("Error fetching beneficiaries");
  }
}

export async function updateBeneficiary({ beneficiaryId }: { beneficiaryId: string }) {
  try {
    const beneficiary = await prisma.beneficiary.findUnique({
      where: {
        id: beneficiaryId,
      },
    });

    if (!beneficiary) {
      return {
        message: "Beneficiary not found",
      };
    }

    const updatedBeneficiary = await prisma.beneficiary.update({
      where: {
        id: beneficiaryId,
      },
      data: {
        ...beneficiary,
      },
    });
    revalidatePath("/dashboard/beneficiaries");
    return {
      message: "Beneficiary updated successfully",
      data: beneficiary,
    };
  } catch (error) {
    throw new Error("Error updating beneficiary");
  }
}

export async function deleteBeneficiary(id: string) {
  try {
    const beneficiary = await prisma.beneficiary.delete({
      where: {
       id: id,
      },
    });
    revalidatePath("/dashboard/beneficiaries");
    return {
      message: "Beneficiary deleted successfully",
      data: beneficiary,
    };
  } catch (error) {
    throw new Error("Error deleting beneficiary");
  }
}
