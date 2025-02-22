import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const data = await req.json()

    const {name} = data

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as {userId : string}
    const userId = decoded.userId;

    try {
        const response = await prisma.spaces.create({
            data : {
                spaceName : name,
                adminId : userId
            }
        })

        const spaceId = response.id;

        return NextResponse.json({
            spaceId
        })

    } catch (error) {
        return NextResponse.json({ message: "Some Error Occured", error }, {
            status : 402
        });
    }

   
}
