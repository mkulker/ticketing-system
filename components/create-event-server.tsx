"use server";
import { supabase } from "@/utils/supabase/supabase";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";

//const supabasei = createClient()

export async function printUser(){
    //const supabase = createClient()
    const { data: {user}} = await createClient().auth.getUser();
    
    if (user != null){
        console.log(user.id);
    }
    else{
        console.log("user is null")
    }
} 

export async function submitEvent(event_name: string, event_location: string, event_description: string, event_start: Date, event_end: Date, event_host: number | null) {
    const { data: {user}} = await createClient().auth.getUser()
    if (user == null){
        throw new Error("You are not logged in!")
    }
    const { error } = await supabase.from("events")
        .insert({
            name: event_name,
            location: event_location,
            description: event_description,
            start:event_start, end:event_end,
            host_org: event_host,
            creator_id: user.id
        })
    return error;
}