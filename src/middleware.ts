//middleware logic here 
// Idk if there's a need or not I can write a action as well but lets see.

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string; 

export async function middleware(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', decoded.userId);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}

export const config = {
    matcher: '/createSpace/:path*', 
};
