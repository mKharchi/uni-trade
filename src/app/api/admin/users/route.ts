import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { deflate } from "zlib";

export async function GET(request:NextRequest) {
        try {
            const students = await prisma.student.findMany()
            const admins = await prisma.admin.findMany()
            
        } catch (error:any) {
                return NextResponse.json({
                    success:false , 
                    message:"error fetching users",
                    details:error.message

                } , {
                    status:500
                })
        }
}