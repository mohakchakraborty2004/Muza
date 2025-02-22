"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
//import type { Space } from "./page"
import { jwtDecode } from "jwt-decode"
import fetchSpace from "@/lib/actions/fetchSpace"
import axios from "axios"

type Space = {
    id?: string
    name: string
  }

interface DashboardContentProps {
  username: string
}

export function DashboardContent({ username}: DashboardContentProps) {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [newSpace, setNewSpace] = useState("")
  const [add, setAdd] = useState<boolean>(false)



    useEffect(()=> {
     
    }, [add]);

    // const fetch = async() => {
    //   const res : Space = await fetchSpace(localStorage.getItem("token")!);
    //   setSpaces([res]);
    // }

  const handleCreateSpace = async () => {
     await axios.post("/api/createSpace", {
      data : {
        spaceName : newSpace
      }
    }, {
      headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      }
    })
    setAdd(true)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">
        Welcome back, <span className="text-violet-400">{username}</span>
      </h1>
      <h2 className="text-2xl mb-8">
        Welcome to <span className="text-violet-400">Muza</span>
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl mb-4">Create a Space</h3>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Enter space name"
              value={newSpace}
              onChange={(e) => setNewSpace(e.target.value)}
              className="bg-gray-800 text-white"
            />
            <Button onClick={handleCreateSpace}>Create Space</Button>
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-4">Your Spaces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <Card key={space.id} className="bg-gray-800">
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Space ID: {space.id}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/space/${space.id}`} passHref>
                    <Button>Join Space</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-4">Join a Space</h3>
          <div className="flex space-x-4">
            <Input type="text" placeholder="Enter space code" className="bg-gray-800 text-white" />
            <Button>Join Space</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

