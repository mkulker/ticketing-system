"use client";

import { supabase } from "@/utils/supabase/supabase";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import EventCard from "@/components/event-card";
import { useState, useEffect } from "react";
import { Link } from "lucide-react";

export default function Header() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchEvents = async () => {

    try {
      setLoading(true); 
      const { data, error } = await supabase
        .from('events') 
        .select('*'); 

      if (error) throw error;

      setEvents(data); 
    } catch (error: any) {
      setError(error.message); 
    } finally {
      setLoading(false); 
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
            title={event.name}
            date={event.date}
            location={event.location}
            description={event.description}
            startDate={event.start}  
            endDate={event.end}
            event_id={event.id}
          />
        ))}
      </div>
    </div>
  );
}
