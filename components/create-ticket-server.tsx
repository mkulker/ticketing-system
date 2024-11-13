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

export async function submitTicket(ticket_type: number) {
    const { data: {user}} = await createClient().auth.getUser()
    if (user == null){
        throw new Error("You are not logged in!")
    }
    const {error } = await supabase.from("tickets")
        .insert({
            ticket_type: ticket_type,
        })


    return error;
}


export async function submitTicketType(event_id: number, price:number,remaining:number,description:string) {
    const { data: {user}} = await createClient().auth.getUser()
    if (user == null){
        throw new Error("You are not logged in!")
    }
    const { data,error } = await supabase.from("ticket_types")
        .insert({
            event_id: event_id,
            price: price,
            remaining: remaining,
            description: description
        }).select("id")  // This selects the ID of the inserted event
        .single();     // This ensures we get a single object instead of an array
        if (error) {
            throw new Error(`Failed to create event: ${error.message}`);
        }
    
        // Ensure data is not null before accessing data.id
        if (!data) {
            throw new Error("Event creation failed: No data returned.");
        }
    return data.id;
}