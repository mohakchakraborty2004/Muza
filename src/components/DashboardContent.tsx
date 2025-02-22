"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import fetchName from "@/lib/actions/fetchName"
import fetchSpace from "@/lib/actions/fetchSpace"
import axios from "axios"

type space = {
    id?: string
    spaceName: string
  }

interface res {
  spaceId : any
}

interface DashboardContentProps {
  username: string
}

export function DashboardContent() {
  const [spaces, setSpaces] = useState<space[]>([])
  const [newSpace, setNewSpace] = useState("")
  const [add, setAdd] = useState<boolean>(false)
  const [username, setUsername] = useState<any>("John Doe")
  const [code, setCode] = useState<any>("");
  const router = useRouter();


     useEffect(()=> {
       const fetch = async() => {
        const token = localStorage.getItem('token');
        const res = await fetchSpace(token!);
            setSpaces(res);
       }

      //  const fetchname = async() => {
      //   const user = await fetchName(localStorage.getItem('token')!);
      //   setUsername(user);
      // }

      // fetchname();

       fetch(); 
     }, []);


  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-[4rem] font-bold mb-4">
        Welcome back, <span className="text-violet-400">Muzer</span>
      </h1>
      <h2 className="text-[2rem] font-semibold mb-8">
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
            <Button onClick={async () => {
   const res = await axios.post<res>("/api/createSpace", {
        name : newSpace
    }, {
      headers : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      }
    })
    const space = res.data.spaceId;
    router.push(`/space/${space}`);
    setAdd(true)
  }}>Create Space</Button>
          </div>
        </div>

        <div>
          <h3 className="text-2xl mb-4 font-bold">Your Spaces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spaces.map((space) => (
              <Card key={space.id} className="bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-violet-500">{space.spaceName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white"><span className="text-violet-500 font-bold">Space ID: </span>{space.id}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/space/${space.id}`} passHref>
                    <Button className="bg-violet-700">Join Space</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-4">Join a Space</h3>
          <div className="flex space-x-4">
            <Input type="text" placeholder="Enter space code" className="bg-gray-800 text-white" onChange={(e)=> {
              setCode(e.target.value);
            }}/>
            <Button 
            onClick={()=> {
              router.push(`/space/${code}`);
            }}>Join Space</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

