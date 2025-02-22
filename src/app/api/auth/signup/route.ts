import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string; 

export async function POST( req: NextRequest , res : NextResponse) {
    const data = await req.json()
    const {email, username, password} = data;
    // console.log (email, username, password);

    // database logic here
    try {
        // const Exstuser = await prisma.user.findUnique({
        //     where : {
        //         email : email
        //     }
        // }) 
    
        // if (Exstuser) {
        //     alert("user Already exists") // use better popup
        //     return NextResponse.redirect('/auth/signin') //create a login page
        // }
    
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
        console.log(error);
        return NextResponse.json({
            msg : "some error occured",
            error
        }, {
            status : 500
        })
    }
    

}