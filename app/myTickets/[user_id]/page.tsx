// userbuysticket/page.tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type TicketType = {
  id: number;
  ticket_type: number;
  description: string;
  price: number;
  remaining: number;
  ticketType?: {
    description: string;
    price: number;
    remaining: number;
  };
};

const supabase = createClient();

export default function TicketTypesPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const url = window.location.href;
        const strs = url.split("/");
        const userId = strs[strs.length - 1];

        console.log("Extracted userId:", userId);

        if (!userId) {
          throw new Error("Invalid user ID");
        }

        const { data: ticketsData, error: ticketsError } = await supabase
          .from("tickets")
          .select("*")
          .eq("owner", userId);

        if (ticketsError) {
          setError(ticketsError.message);
          setLoading(false);
          return;
        }

        console.log("Fetched ticketsData:", ticketsData);

        const ticketTypesPromises = ticketsData.map(async (ticket) => {
          console.log("Processing ticket:", ticket);
          if (!ticket.ticket_type) {
            throw new Error(`Invalid ticket type for ticket ID: ${ticket.id}`);
          }

          const { data: ticketTypeData, error: ticketTypeError } = await supabase
            .from("ticket_types")
            .select("*")
            .eq("id", ticket.ticket_type)
            .single();

          if (ticketTypeError) {
            throw new Error(ticketTypeError.message);
          }

          console.log("Fetched ticketTypeData:", ticketTypeData);

          return { ...ticket, ticketType: ticketTypeData };
        });

        const ticketsWithTypes = await Promise.all(ticketTypesPromises);
        setTickets(ticketsWithTypes);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="border p-4 rounded-md shadow-md">
              <p><strong>Description:</strong> {ticket.ticketType?.description}</p>
              <p><strong>Price:</strong> {ticket.ticketType?.price}</p>
              <p><strong>Remaining:</strong> {ticket.ticketType?.remaining}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}