// components/EventForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabase"; // Set up Supabase client
import { submitEvent } from "@/components/create-event-server";
import { submitTicketType, submitTicket } from "./create-ticket-server";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [category, setCategory] = useState<string[]>([]);

  const [ticketTypes, setTicketTypes] = useState([
    { price: "", remaining: "", description: "" },
  ]);

  const categories = [
    "Concert",
    "Movie",
    "Play",
    "Athletics",
    "Conference",
    "Convention",
    "Other",
  ];

  interface TicketType {
    price: string | number;
    remaining: string | number;
    description: string;
  }

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index][field] = value as never;
    setTicketTypes(newTicketTypes);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { price: "", remaining: "", description: "" }]);
  };

  const removeTicketType = (index: number) => {
    const newTicketTypes = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(newTicketTypes);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategory([...category, value]);
    } else {
      setCategory(category.filter((cat) => cat !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const eventId = await submitEvent(
      eventName,
      location,
      description,
      new Date(startTime),
      new Date(endTime),
      null,
      category
    );

    for (const ticketType of ticketTypes) {
      const ticketTypeId = await submitTicketType(
        eventId,
        parseFloat(ticketType.price as string),
        parseInt(ticketType.remaining as string),
        ticketType.description
      );

      const ticketPromises = Array.from({ length: parseInt(ticketType.remaining as string) }).map(() =>
        submitTicket(ticketTypeId)
      );

      await Promise.all(ticketPromises);
    }

    setLoading(false);
    setSuccessMessage("Event submitted successfully!");
    setEventName("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setDescription("");
    setCategory([]);
    setTicketTypes([{ price: "", remaining: "", description: "" }]);
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
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <div>
          <h3 className="font-semibold text-xl mb-2">Categories</h3>
          {categories.map((cat) => (
            <div key={cat} className="flex items-center">
              <input
                type="checkbox"
                value={cat}
                onChange={handleCategoryChange}
                className="mr-2"
              />
              <label>{cat}</label>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-2">Ticket Types</h3>
          {ticketTypes.map((ticketType, index) => (
            <div key={index} className="flex flex-col gap-2 mb-4">
              <input
                type="number"
                placeholder="Price"
                value={ticketType.price}
                onChange={(e) => handleTicketTypeChange(index, "price", e.target.value)}
                className="border p-2 rounded-md"
                required
              />
              <input
                type="number"
                placeholder="Remaining"
                value={ticketType.remaining}
                onChange={(e) => handleTicketTypeChange(index, "remaining", e.target.value)}
                className="border p-2 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={ticketType.description}
                onChange={(e) => handleTicketTypeChange(index, "description", e.target.value)}
                className="border p-2 rounded-md"
                required
              />
              <button type="button" onClick={() => removeTicketType(index)} className="border p-2 rounded-md bg-red-500 text-white">
                Remove Ticket Type
              </button>
            </div>
          ))}
          <button type="button" onClick={addTicketType} className="border p-2 rounded-md bg-blue-500 text-white">
            Add Ticket Type
          </button>
        </div>
        <button type="submit" disabled={loading} className="border p-2 rounded-md bg-green-500 text-white">
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;