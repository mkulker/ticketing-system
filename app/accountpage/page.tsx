"use server"
import React from "react"
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


export async function AccountPage(){
    const { data, error } = await supabase.auth.getUser();
    return (
        <div>
            <h1 className="text-2xl font-medium">Account Info</h1>
            <h2 className="text-2xl font-medium">Email: {data.user == null ? "failed to get user email" : data.user.email}</h2>
            <form action={signOutAction}>
                <Button type="submit" variant={"outline"}>
                    Sign out
                </Button>
            </form>
      </div>
    )
}