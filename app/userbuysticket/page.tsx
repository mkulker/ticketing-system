// userbuysticket/page.tsx
"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type TicketType = {
  id: number;
  description: string;
  price: number;
  remaining: number;
};
const supabase = createClient();

export default function TicketTypesPage() {
  const eventId = "1";
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [ticketAmount, setTicketAmount] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        if (!eventId) return;

        const { data, error } = await supabase
          .from("ticket_types")
          .select("id, description, price, remaining")
          .eq("event_id", eventId);

        if (error) {
          setError("Failed to fetch ticket types: " + error.message);
        } else {
          setTicketTypes(data || []);
          setError(null);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserUid = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserUid(user?.id || null);
    };

    fetchTicketTypes();
    fetchUserUid();
  }, [eventId]);

  const handlePurchase = async () => {
    setError(null);

    if (!selectedTicketType) {
      setError("Please select a ticket type.");
      return;
    }

    if (ticketAmount <= 0) {
      setError("Please enter a valid ticket amount.");
      return;
    }

    if (!userUid) {
      setError("User is not authenticated.");
      return;
    }

    try {
      const { data: availableTickets, error: fetchError } = await supabase
        .from("tickets")
        .select("id")
        .eq("ticket_type", selectedTicketType)
        .is("owner", null)
        .limit(ticketAmount);

      if (fetchError) {
        setError("Error fetching available tickets: " + fetchError.message);
        return;
      }

      if (availableTickets.length < ticketAmount) {
        setError("Not enough tickets available.");
        return;
      }

      const ticketIds = availableTickets.map((ticket) => ticket.id);

      const { error: updateError } = await supabase
        .from("tickets")
        .update({ owner: userUid })
        .in("id", ticketIds);

      if (updateError) {
        setError("Error purchasing tickets: " + updateError.message);
        return;
      }
      const rem = ticketTypes.reduce((sum, ticket) => {
        if (ticket.id === Number(selectedTicketType)) return sum + ticket.remaining;
        return sum;
      }, 0)

      const { error: decrementError} = await supabase
      .from("ticket_types")
      .update({ remaining: rem - ticketAmount })
      .eq("id", selectedTicketType);

      if (decrementError) {
        console.error("Error updating remaining ticket count:", decrementError);
        return;
      }

      alert("Tickets purchased successfully!");

      const { data, error } = await supabase
        .from("ticket_types")
        .select("id, description, price, remaining")
        .eq("event_id", eventId);
      if (!error) setTicketTypes(data || []);
      
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  if (loading) return <p>Loading ticket types...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Available Ticket Types</h1>
      {ticketTypes.length === 0 ? (
        <p>No ticket types available for this event.</p>
      ) : (
        <ul className="space-y-4">
          {ticketTypes.map((ticket) => (
            <li key={ticket.id} className="p-4 border border-gray-300 rounded-lg">
              <h2 className="text-xl font-semibold">{ticket.description}</h2>
              <p>Price: ${ticket.price.toFixed(2)}</p>
              <p>Remaining Tickets: {ticket.remaining}</p>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Purchase Tickets</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePurchase();
          }}
          className="space-y-4"
        >
          <label className="block">
            Ticket Type:
            <select
              className="w-full p-2 border rounded"
              value={selectedTicketType}
              onChange={(e) => setSelectedTicketType(e.target.value)}
            >
              <option value="">Select a ticket type</option>
              {ticketTypes.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.description}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            Number of Tickets:
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={ticketAmount}
              onChange={(e) => setTicketAmount(parseInt(e.target.value))}
              min="1"
              max="10"
            />
          </label>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Purchase
          </button>
        </form>
        <p className="mt-4 text-gray-500">User UID: {userUid}</p>
      </div>
    </div>
  );
}
