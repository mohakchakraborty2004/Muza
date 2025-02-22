"use server";

import jwt from "jsonwebtoken";
import prisma from "@/db";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

const fetchName = async(token : string) => {
  const decoded = jwt.verify(token,SECRET_KEY) as  {userId : string} ;
        const userId = decoded.userId 

        try {
            const response = await prisma.user.findUnique({
                where : {
                    id : userId
                } ,
                select : {
                    username : true
                }
            })

            const username = response;

            return username;
        } catch (error) {
            console.log(error);
            return "John Doe"
        }
} 

export default fetchName;