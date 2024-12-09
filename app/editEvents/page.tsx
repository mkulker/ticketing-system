"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const EditEventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
    const { data: {user}} = await createClient().auth.getUser();

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("creator_id", user?.id);

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data || []);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Events</h1>
      {events.length === 0 ? (
        <p>No events found. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-md p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-bold">{event.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <Link
                href={`/editEvents/${event.id}`}
                className="text-blue-500 hover:underline"
              >
                Edit Event
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditEventsPage;
