// components/EventForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabase"; //set up superbase client

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [totalTickets, setTotalTickets] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from("events").insert([
      {
        event_name: eventName,
        date: date,
        ticket_price: ticketPrice,
        total_tickets: totalTickets,
        available_tickets: totalTickets,
        description: description,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error submitting event:", error.message);
    } else {
      console.log("suvcess");
      setSuccessMessage("Event submitted successfully!");
      setEventName("");
      setDate("");
      setTicketPrice("");
      setTotalTickets("");
      setDescription("");
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
          required
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Ticket Price"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Total Tickets"
          value={totalTickets}
          onChange={(e) => setTotalTickets(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-md"
          required
        ></textarea>
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