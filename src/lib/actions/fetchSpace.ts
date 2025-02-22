"use server"; 
import prisma from "@/db";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

async function fetchSpace(token : string) {
    
    try {
        const decoded = jwt.verify(token,SECRET_KEY) as  {userId : string} ;
        const userId = decoded.userId 
        const response = await prisma.spaces.findMany({
            where : {
                adminId : userId
            }
        })

        return response.map(({ spaceName, id }) => ({ spaceName , id }));

    } catch (error) {
        console.log(error)
    }
}

export default fetchSpace;