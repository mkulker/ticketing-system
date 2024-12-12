"use server";
import { supabase } from "@/utils/supabase/supabase";
import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import fetch from 'node-fetch'; // Import fetch for server-side requests

export async function printUser() {
    const { data: { user } } = await createClient().auth.getUser();
    
    if (user != null) {
        console.log(user.id);
    } else {
        console.log("user is null");
    }
}

export async function getGeoCoordinates(address: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data: { lat: string, lon: string }[] = await response.json() as { lat: string, lon: string }[];

    if (data.length === 0) {
        throw new Error("Address not found");
    }

    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
}

export async function submitEvent(event_name: string, event_location: string, event_description: string, event_start: Date, event_end: Date, event_host: number | null, event_category: string[], latitude: number, longitude: number) {
    const { data: { user } } = await createClient().auth.getUser();
    if (user == null) {
        throw new Error("You are not logged in!");
    }

    const { data, error } = await supabase.from("events")
        .insert({
            name: event_name,
            location: event_location,
            description: event_description,
            start: event_start,
            end: event_end,
            creator_id: user.id,
            category: event_category,
            geopoint: `SRID=4326;POINT(${longitude} ${latitude})` // Insert the geo coordinates as a POINT with SRID 4326
        }).select("id")  // This selects the ID of the inserted event
        .single();     // This ensures we get a single object instead of an array

    // Check if there was an error in inserting the event
    if (error) {
        throw new Error(`Failed to create event: ${error.message}`);
    }

    // Ensure data is not null before accessing data.id
    if (!data) {
        throw new Error("Event creation failed: No data returned.");
    }

    // Return the ID of the newly created event
    return data.id;
}