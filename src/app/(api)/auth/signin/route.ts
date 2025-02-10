import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import  jwt  from "jsonwebtoken";

export async function POST( req: NextRequest , res : NextResponse) {
    const data = await req.json()
    const {email, username, password} = data;

    // database logic here
    try {
        const Exstuser = await prisma.user.findUnique({
            where : {
                email : email,
                username : username
            }
        }) 
    
        if (!Exstuser) {
            alert("user doesnt exist on app") // use better popup
            return NextResponse.redirect('/Signup') //create a signup page
        }
    
       const dbPassword = Exstuser.password; 
       const userId = Exstuser.id

       if (dbPassword === password) {
        const token = jwt.sign({userId}, "secret");

        return NextResponse.json({
            msg : "account created",
            token
        }, {
            status: 200
        })
        
       }
    
    
    } catch (error) {
        return NextResponse.json({
            msg : "some error occured",
            error
        }, {
            status : 500
        })
    }
    

}