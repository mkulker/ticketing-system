"use server"
import React from "react"
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


export async function AccountPage(){
    const { data: { user } } = await supabase.auth.getUser();
    return (
        <div>
            <h1 className="text-2xl font-medium">Account Info</h1>
            <h2 className="text-2xl font-medium">Email: {user == null ? "failed to get user email" : user.email}</h2>
      </div>
    )
}