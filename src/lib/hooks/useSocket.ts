"use client";
import { useEffect, useState } from "react"

export const useSocket = () => {

    const [socket, setSocket] = useState<WebSocket | null>(null);
  
    useEffect(() => {
        const wss = new WebSocket( "ws://localhost:8080")

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