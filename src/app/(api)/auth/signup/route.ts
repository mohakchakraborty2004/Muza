import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import  jwt  from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string; 

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
    
        if (Exstuser) {
            alert("user Already exists") // use better popup
            return NextResponse.redirect('/login') //create a login page
        }
    
        const User = await prisma.user.create({
            data : {
                email : email, 
                username : username, 
                password: password
            }
        })
    
       const userId = User.id;
    
        //jwt logic here
       const token = jwt.sign({userId}, SECRET_KEY);
        
    
        return NextResponse.json({
            msg : "account created",
            token
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            msg : "some error occured",
            error
        }, {
            status : 500
        })
    }
    

}