import { NextRequest, NextResponse } from "next/server";

export async function POST( req: NextRequest , res : NextResponse) {
    const data = await req.json()
    const {email, username, password} = data;

    // database logic here

    //jwt logic here

    return NextResponse.json({
        msg : "account created"
    })

}