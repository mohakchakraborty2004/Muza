"use client"

import { useState } from "react"
import { CardSpotlight } from "./ui/card-spotlight"
import { Button } from "./ui/moving-border"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

interface SignupResponse {
  msg : string,
  token : string
}

export function Form() {
    const [email, setEmail] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [password, setPw] = useState<string>("")
    const navigate = useRouter()
    return (
        <div className="grid grid-cols-2 gap-10 p-28">
            <div className="flex flex-col justify-center rounded-lg p-5 inset-0 backdrop-blur-md" >
              <input type="email" placeholder="Spiderman@gmail.com"  className="bg-neutral-900 p-3 text-white font-semibold rounded-full m-3" onChange={(e: any)=> {
                setEmail(e.target.value);
              }}/>
              <input type="text" placeholder="moChak.rs" className="bg-neutral-900 p-3 text-white font-semibold rounded-full m-3" onChange={(e: any)=> {
                setUsername(e.target.value);
              }}/>
              <input type="password" placeholder="IamPeterParker" className="bg-neutral-900 p-3 text-white font-semibold rounded-full m-3 mb-5" onChange={(e: any)=> {
                setPw(e.target.value);
              }}/>
              <div className="flex items-center justify-center mt-2">
              <button className="bg-white text-black font-extrabold rounded-lg p-2"
               onClick={async () => {
                console.log("clicked");
                try {
                  const res = await axios.post<SignupResponse>("http://localhost:3000/api/auth/signup", {
                    data: {
                      email,
                      username,
                      password
                    }
                  })
  
                  const token = res.data.token;
                  localStorage.setItem('token', token);
                  navigate.push('/dashboard');
                } catch (error) {
                  console.log(error);
                  alert("some error occured")
                }
  
              }}
              >Submit</button>

      <p className="text-white font-thin pl-3">Already have an account? <Link href={'/auth/signin'}>
      <span className="font-bold">Login</span>
      </Link> </p>
            </div> 
            </div>

              <div className="flex justify-center ">
              <CardSpotlight className="h-96 w-96 flex flex-col justify-center">
      <p className="text-xl font-bold relative z-20 mt-2 text-white">
        Authentication steps
      </p>
      <div className="text-neutral-200 mt-4 relative z-20">
        Follow these steps to secure your account:
        <ul className="list-none  mt-2">
          <Step title="Enter your email address" />
          <Step title="Create a unique username" />
          <Step title="Enter a Strong password" />
          <Step title="Start listening" />
        </ul>
      </div>
      <p className="text-neutral-300 mt-4 relative z-20 text-sm">
        Ensuring your account is properly secured helps protect your personal
        information and data.
      </p>
    </CardSpotlight>
                </div>  
        </div>
    )
}

const Step = ({ title }: { title: string }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-white">{title}</p>
    </li>
  );
};
 
const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
};