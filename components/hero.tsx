"use client";

import { supabase } from "@/utils/supabase/supabase";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import EventCard from "@/components/event-card";
import { useState, useEffect } from "react";
// const events = [
//   {
//     title: "Event 1",
//     date: "2023-10-01",
//     location: "Location 1",
//     description: "Description for Event 1",
//   },
//   {
//     title: "Event 2",
//     date: "2023-10-02",
//     location: "Location 2",
//     description: "Description for Event 2",
//   },
//     {
//     title: "Event 2",
//     date: "2023-10-02",
//     location: "Location 2",
//     description: "Description for Event 2",
//   },
//   // Add more events as needed
// ];

export default function Header() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchEvents = async () => {

    try {
      setLoading(true); // Set loading state to true before fetching data
      const { data, error } = await supabase
        .from('events') // Specify the table name
        .select('*'); // Select all columns, you can specify specific columns if needed

      if (error) throw error; // If there's an error, throw it

      setEvents(data); // Set the data to state
    } catch (error: any) {
      setError(error.message); // Set error state if any error occurs
    } finally {
      setLoading(false); // Set loading to false when the fetch is done
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col gap-16 items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Ticketing System Alpha
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <div className="flex flex-wrap gap-4 justify-center">
        {events.map((event, index) => (
          <EventCard
            key={index}
            title={event.title}
            date={event.date}
            location={event.location}
            description={event.description}
          />
        ))}
      </div>
    </div>
  );
}
