// components/EventForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabase"; //set up superbase client
import { printUser, submitEvent } from "@/components/create-event-server"
import { submitTicketType,submitTicket } from "./create-ticket-server";
import { error } from "console";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const[price, setPrice] = useState(0);
  const[remaining, setRemaining] = useState(0);


  const ticketdesc = 'This is a ticket for the event';
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Hnalding that SUbmit! Oh yeat baybee")
    e.preventDefault();
    setLoading(true);

    const id = await submitEvent(
      eventName,
      location,
      description,
      new Date(startTime),
      new Date(endTime),
      null
    );

    const ticket_type_id = await submitTicketType(
      id,
      price,
      remaining,
      ticketdesc
    );

    for (let i = remaining; i >0; i--){
      const error = await submitTicket(
      ticket_type_id
    );
    console.log(error); 
    }
    
    
      setLoading(false);
      console.log("suvcess");
      setSuccessMessage("Event submitted successfully!");
      setEventName("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setDescription("");

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

        <input
          type="number"
          placeholder="Price"
          value={price} // This should be state for the price
          onChange={(e) => setPrice(Number(e.target.value))} // Convert the input value to a number
          className="border p-2 rounded-md"
        // required
        />

        <input
          type="number"
          placeholder="Number of Tickets"
          value={remaining} // This should be state for the price
          onChange={(e) => setRemaining(Number(e.target.value))} // Convert the input value to a number
          className="border p-2 rounded-md"
        // required
        />

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