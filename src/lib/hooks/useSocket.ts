"use client";
import { useEffect, useState } from "react"
import dotenv from "dotenv";
dotenv.config();
const REDIS_URL = process.env.REDIS_URL as string

export const useSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);
  
    useEffect(() => {
        if(socket) {return}
        const wss = new WebSocket("https://muza-wsserver.onrender.com");

        wss.onopen = () => {
            console.log("socket connected");
            setSocket(wss);
        }

        wss.onclose = () => {
            console.log("closed");
            setSocket(null);
        }
        
    }, [])

    return socket;
}