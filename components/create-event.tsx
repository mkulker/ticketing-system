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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ lat: string, lon: string, display_name: string }[]>([]);

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

  const handleAddressSearch = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();

      if (data.length === 0) {
        setError("Address not found");
        setSearchResults([]);
        return;
      }

      // Clean the search results to only show the address
      const cleanedResults = data.map((result: { lat: string, lon: string, display_name: string }) => ({
        lat: result.lat,
        lon: result.lon,
        display_name: result.display_name,
      }));

      setSearchResults(cleanedResults);
      setError(null);
    } catch (error) {
      console.error("Error fetching geo coordinates:", error);
      setError("An error occurred while fetching geo coordinates.");
      setSearchResults([]);
    }
  };

  const handleSelectResult = (result: { lat: string, lon: string, display_name: string }) => {
    setLocation(result.display_name);
    setLatitude(parseFloat(result.lat));
    setLongitude(parseFloat(result.lon));
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (latitude === null || longitude === null) {
        throw new Error("Please search for a valid address.");
      }

      const eventId = await submitEvent(
        eventName,
        location,
        description,
        new Date(startTime),
        new Date(endTime),
        null,
        category,
        latitude,
        longitude
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

      setSuccessMessage("Event submitted successfully!");
      setEventName("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setDescription("");
      setCategory([]);
      setLatitude(null);
      setLongitude(null);
      setTicketTypes([{ price: "", remaining: "", description: "" }]);
      setSearchResults([]);
    } catch (error) {
      console.error("Error submitting event:", error);
      setError("An error occurred while submitting the event.");
    } finally {
      setLoading(false);
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
      {error && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>Name:</label>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="border p-2 rounded-md"
          maxLength={20}
          required
        />
        <label>Start Time:</label>
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded-md"
          required
        />
        <label>End Time:</label>
        <input
          type="datetime-local"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          min = {startTime}
          className="border p-2 rounded-md"
          required
        />
        <label>Location:</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 rounded-md flex-grow"
            required
          />
          <button type="button" onClick={handleAddressSearch} className="border p-2 rounded-md bg-blue-500 text-white">
            Search
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-xl mb-2">Search Results</h3>
            <ul className="border p-2 rounded-md bg-gray-100 text-gray-400">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer hover:bg-gray-200 p-2 rounded text-gray-400"
                  onClick={() => handleSelectResult(result)}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
        )}
        <label>Description:</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-md"
          maxLength={100}
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
              <label>Price:</label>
              <input
                type="number"
                placeholder="Price"
                value={ticketType.price}
                min="0"
                onChange={(e) => handleTicketTypeChange(index, "price", e.target.value)}
                className="border p-2 rounded-md"
                required
              />
              <label>Allocated Tickets:</label>
              <input
                type="number"
                placeholder="Remaining"
                value={ticketType.remaining}
                min="1"
                onChange={(e) => handleTicketTypeChange(index, "remaining", e.target.value)}
                className="border p-2 rounded-md"
                required
              />
              <label>Description:</label>
              <input
                type="text"
                placeholder="Description"
                value={ticketType.description}
                onChange={(e) => handleTicketTypeChange(index, "description", e.target.value)}
                className="border p-2 rounded-md"
                required
              />
              <div>
                {(<button type="button" onClick={() => removeTicketType(index)} className="border p-2 rounded-md bg-red-500 text-white">
                Remove Ticket Type
                </button>
                )}
              </div>
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