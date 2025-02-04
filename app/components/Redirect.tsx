"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export function Redirect() {
    const {data : session, status} = useSession();
    const router = useRouter();
    useEffect(()=> {
        if(status === "authenticated") {
            router.push("/dashboard")
        }
    },[status, router])
    return null;
}