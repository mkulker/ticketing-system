"use client";

import { supabase } from "@/utils/supabase/supabase";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import EventCard from "@/components/event-card";
import { useState, useEffect } from "react";
import { Link } from "lucide-react";
import { Button, ButtonGroup } from "@nextui-org/react";
import {Input} from "@nextui-org/react";

// This is the home page of the app, where the user can search for events and filter them by category

export default function Header() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [f, updateFilters] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [search, updateSearch] = useState("");
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
  
// Function to handle button clicks and update filters
function handleClick(a: number) {
  if(a == 0) updateFilters(f => [(f[0] == 0 ? 1 : 0), f[1], f[2], f[3], f[4], f[5], f[6]]);
  else if(a == 1) updateFilters(f => [f[0], (f[1] == 0 ? 1 : 0), f[2], f[3], f[4], f[5], f[6]]);
  else if(a == 2) updateFilters(f => [f[0], f[1], (f[2] == 0 ? 1 : 0), f[3], f[4], f[5], f[6]]);
  else if(a == 3) updateFilters(f => [f[0], f[1], f[2], (f[3] == 0 ? 1 : 0), f[4], f[5], f[6]]);
  else if(a == 4) updateFilters(f => [f[0], f[1], f[2], f[3], (f[4] == 0 ? 1 : 0), f[5], f[6]]);
  else if(a == 5) updateFilters(f => [f[0], f[1], f[2], f[3], f[4], (f[5] == 0 ? 1 : 0), f[6]]);
  else if(a == 6) updateFilters(f => [f[0], f[1], f[2], f[3], f[4], f[5], (f[6] == 0 ? 1 : 0)]);
}


// Function to check if an event matches the search terms and filters
function checkTerms(filter: number[], search: string, event: any) {
  // If no search term and no filters are applied, show all events
  if(search == "" && JSON.stringify(filter) == JSON.stringify([0, 0, 0, 0, 0, 0, 0])) return true;
  
  // If event has no category and filters are applied, hide the event
  if(event.category == null && JSON.stringify(filter) != JSON.stringify([0, 0, 0, 0, 0, 0, 0])) return false;
  
  // If event has categories and filters are applied, check if event fits any category
  if(event.category != null && JSON.stringify(filter) != JSON.stringify([0, 0, 0, 0, 0, 0, 0])) {
    const eventTypes = ["Concert", "Movie", "Play", "Athletics", "Conference", "Convention", "Other"];
    var fitsCat = false;
    event.category.map((e: any) => fitsCat = fitsCat || (filter[eventTypes.indexOf(e)] != 0));
    if(!fitsCat) return false;
  }
  
  // If search term is not empty, check if event name, description, or location matches the search term
  if(search != "" && event.name.toLowerCase().indexOf(search.toLowerCase()) == -1 && event.description.toLowerCase().indexOf(search.toLowerCase()) == -1 && event.location.toLowerCase().indexOf(search.toLowerCase()) == -1) return false;
  
  // If all checks pass, show the event
  return true;
}

// Main component rendering the event finder UI
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" alt="Favicon" className="w-20 h-20" /> 
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
          Event Finder
        </p>

      </div>
      <div className="rounded-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"> {/* Responsive width classes */}

      <Input
        variant="flat"
        type="text"
        placeholder="Search"
        className="p-0 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 w-full"
        onChange={(e) => updateSearch((search) => e.target.value)}
      />
      </div>
      <div>
      <ButtonGroup size="lg" className="px-4 py-4 rounded-md">
        <Button
          onPress={(e) => handleClick(0)}
          color={f[0] == 0 ? "secondary" : "primary"}
          className="rounded-l-full text-lg py-3 px-6"
        >
          Concerts
        </Button>
        <Button
          onPress={(e) => handleClick(1)}
          color={f[1] == 0 ? "secondary" : "primary"}
          className="text-lg py-3 px-6"
        >
          Movies
        </Button>
        <Button
          onPress={(e) => handleClick(2)}
          color={f[2] == 0 ? "secondary" : "primary"}
          className="text-lg py-3 px-6"
        >
          Plays
        </Button>
        <Button
          onPress={(e) => handleClick(3)}
          color={f[3] == 0 ? "secondary" : "primary"}
          className="text-lg py-3 px-6"
        >
          Athletics
        </Button>
        <Button
          onPress={(e) => handleClick(4)}
          color={f[4] == 0 ? "secondary" : "primary"}
          className="text-lg py-3 px-6"
        >
          Conferences
        </Button>
        <Button
          onPress={(e) => handleClick(5)}
          color={f[5] == 0 ? "secondary" : "primary"}
          className="text-lg py-3 px-6"
        >
          Conventions
        </Button>
        <Button
          onPress={(e) => handleClick(6)}
          color={f[6] == 0 ? "secondary" : "primary"}
          className="rounded-r-full text-lg py-3 px-6"
        >
          Other
        </Button>
      </ButtonGroup>        </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <div className="flex flex-wrap gap-4 justify-center">
        {events.map((event, index) => (
          checkTerms(f, search, event) && <EventCard
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