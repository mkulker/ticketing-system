require("dotenv").config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
jest.mock("@/components/create-ticket-server", () => ({
  submitTicketType: jest.fn(),
}));

const { submitTicketType } = require("@/components/create-ticket-server");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

describe('submitTicketType', () => {

  test('should throw an error if ticket type creation fails', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      const { error } = await supabase.from("ticket_types").insert({
        event_id: 1,
        price: 100,
        remaining: 50,
        description: "VIP Ticket"
      }).select("id").single();

      if (error) {
        await expect(
          submitTicketType(1, 100, 50, "VIP Ticket")
        ).rejects.toThrow(`Failed to create event: ${error.message}`);
      }
    }
  });

  test('should return ticket type ID if ticket type creation is successful', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      const { data, error } = await supabase.from("ticket_types").insert({
        event_id: 1,
        price: 100,
        remaining: 50,
        description: "VIP Ticket"
      }).select("id").single();

      if (!error && data) {
        const ticketTypeId = await submitTicketType(
          1,
          100,
          50,
          "VIP Ticket"
        );

        expect(ticketTypeId).toBe(data.id);
      }
    }
  });

  test('should throw an error if event_id is invalid', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      await expect(
        submitTicketType(-1, 100, 50, "VIP Ticket")
      ).rejects.toThrow("Failed to create event: Invalid event ID");
    }
  });

  test('should throw an error if price is invalid', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      await expect(
        submitTicketType(1, -100, 50, "VIP Ticket")
      ).rejects.toThrow("Failed to create event: Invalid price");
    }
  });

  test('should throw an error if remaining tickets is invalid', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      await expect(
        submitTicketType(1, 100, -50, "VIP Ticket")
      ).rejects.toThrow("Failed to create event: Invalid remaining tickets");
    }
  });
});