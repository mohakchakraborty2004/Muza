import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';

export async function POST(req: NextRequest) {
    const userId = req.headers.get('x-user-id');
    const data = await req.json()

    const {name} = data

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await prisma.spaces.create({
            data : {
                spaceName : name,
                adminId : userId
            }
        })

        const spaceId = response.id;

        return NextResponse.redirect(new URL(`/space/${spaceId}`, req.nextUrl.origin));

    } catch (error) {
        return NextResponse.json({ message: "Some Error Occured", error }, {
            status : 402
        });
    }

   
}
