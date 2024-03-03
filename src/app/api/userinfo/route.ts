import prisma from "@/lib/prisma";
import { type NextRequest } from "next/server";
import bcrypt from "bcrypt";
// get all userInfo
export async function GET() {
 try {
    const userInfo = await prisma.userInfo .findMany();
    return Response.json({
        message: "User info retrieved successfully",
        userInfo: userInfo,
        });
 }
    catch (error) {
    throw new Error("Error getting user info");
    }
}

// create userInfo

export async function POST(request : NextRequest) {
    try{
        const {email , userId , username} = await request.json();
        const user = await prisma.userInfo.create({
            data: {
                email: email,
                userId: userId,
                username: username,
                setupCompleted: false,
                balance: 0,
            },
        });
        return {
            message: "User info created successfully",
            user: user,
        };
    }
    catch (error) {
        throw new Error("Error creating user info");
    }
}