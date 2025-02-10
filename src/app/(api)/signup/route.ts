import { NextRequest, NextResponse } from "next/server";

export async function POST( req: NextRequest , res : NextResponse) {
    const data = await req.json()
    

    return NextResponse.json({
        msg : "account created"
    })

}