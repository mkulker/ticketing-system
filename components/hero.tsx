"use client";

import { supabase } from "@/utils/supabase/supabase";
import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import EventCard from "@/components/event-card";
import { useState, useEffect } from "react";
import { Link } from "lucide-react";
import { Button, ButtonGroup } from "@nextui-org/react";
import {Input} from "@nextui-org/react";

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
  
  function handleClick(a: number) {
    if(a == 0) updateFilters(f => [(f[0] == 0 ? 1 : 0), f[1], f[2], f[3], f[4], f[5], f[6]]);
    else if(a == 1) updateFilters(f => [f[0], (f[1] == 0 ? 1 : 0), f[2], f[3], f[4], f[5], f[6]]);
    else if(a == 2) updateFilters(f => [f[0], f[1], (f[2] == 0 ? 1 : 0), f[3], f[4], f[5], f[6]]);
    else if(a == 3) updateFilters(f => [f[0], f[1], f[2], (f[3] == 0 ? 1 : 0), f[4], f[5], f[6]]);
    else if(a == 4) updateFilters(f => [f[0], f[1], f[2], f[3], (f[4] == 0 ? 1 : 0), f[5], f[6]]);
    else if(a == 5) updateFilters(f => [f[0], f[1], f[2], f[3], f[4], (f[5] == 0 ? 1 : 0), f[6]]);
    else if(a == 6) updateFilters(f => [f[0], f[1], f[2], f[3], f[4], f[5], (f[6] == 0 ? 1 : 0)]);
  }

  function handleSearchChange(search: string) {
    
  }


  function checkTerms(filter: number[], search: string, event: any){
    if(search == "" && JSON.stringify(filter) == JSON.stringify([0, 0, 0, 0, 0, 0, 0])) return true;
    //fix this
    if(event.category == null  && JSON.stringify(filter) != JSON.stringify([0, 0, 0, 0, 0, 0, 0])) return false;
    if(event.category != null && JSON.stringify(filter) != JSON.stringify([0, 0, 0, 0, 0, 0, 0])) {
      const eventTypes = ["Concert", "Movie", "Play", "Athletics", "Conference", "Convention", "Other"];
      //map through categories
      var fitsCat = false;
      event.category.map((e: any) => fitsCat = fitsCat || (filter[eventTypes.indexOf(e)] != 0));
      if(!fitsCat) return false;
    }
    //if(filter[eventTypes.indexOf(event.category)] == 0) return false;
    if(search != "" && event.name.toLowerCase().indexOf(search.toLowerCase()) == -1 && event.description.toLowerCase().indexOf(search.toLowerCase()) == -1 && event.location.toLowerCase().indexOf(search.toLowerCase()) == -1) return false;
    return true;
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Event Finder
      </p>
      <div>
      <Input variant="flat" type="text" placeholder="Search" className="p-0 rounded-md" onChange={e => updateSearch(search => e.target.value)}/>  
        <ButtonGroup size="sm" className="px-3 py-3">
            <Button onPress={e => handleClick(0)} color={f[0] == 0 ? "secondary" : "primary"} radius="full">
                Concerts
            </Button>
            <Button onPress={e => handleClick(1)} color={f[1] == 0 ? "secondary" : "primary"} radius="full">
                Movies
            </Button>
            <Button onPress={e => handleClick(2)} color={f[2] == 0 ? "secondary" : "primary"} radius="full">
                Plays
            </Button>
            <Button onPress={e => handleClick(3)} color={f[3] == 0 ? "secondary" : "primary"} radius="full">
                Athletics
            </Button>
            <Button onPress={e => handleClick(4)} color={f[4] == 0 ? "secondary" : "primary"} radius="full">
                Conferences
            </Button>
            <Button onPress={e => handleClick(5)} color={f[5] == 0 ? "secondary" : "primary"} radius="full">
                Conventions
            </Button>
            <Button onPress={e => handleClick(6)} color={f[6] == 0 ? "secondary" : "primary"} radius="full">
                Other
            </Button>
        </ButtonGroup>
        </div>
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