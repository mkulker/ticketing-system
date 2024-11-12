// components/EventForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabase"; //set up superbase client
import { printUser, submitEvent } from "@/components/create-event-server"

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Hnalding that SUbmit! Oh yeat baybee")
    e.preventDefault();
    setLoading(true);

    const error = await submitEvent(
      eventName,
      location,
      description,
      new Date(startTime),
      new Date(endTime),
      null
    );

    /*const { data, error } = await supabase.from("events").insert([
      {
        event_name: eventName,
        date: date,
        ticket_price: ticketPrice,
        total_tickets: totalTickets,
        available_tickets: totalTickets,
        description: description,
      },
    ]);*/

    

    setLoading(false);

    if (error) {
      console.error("Error submitting event:", error.message);
    } else {
      console.log("suvcess");
      setSuccessMessage("Event submitted successfully!");
      setEventName("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setDescription(":3");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="font-semibold text-2xl mb-6">Submit Event</h2>
      {successMessage && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-md">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="border p-2 rounded-md"
          //required
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded-md"
          //required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 rounded-md"
          //required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded-md"
          //required
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-md"
          //required
        ></textarea>
        {/*}<button
          type="button"
          onClick={async () => {await printUser()}}
          className="bg-blue-500 text-white p-2 rounded-md"
        >Show Curr User</button>
        {*/}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Event"}
        </button>
      </form>
    </div>
    
  );
};

export default EventForm;