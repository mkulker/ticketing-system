require("dotenv").config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
jest.mock("@/components/create-event-server", () => ({
  submitEvent: jest.fn(),
}));

const { submitEvent } = require("@/components/create-event-server");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key must be provided.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

describe('submitEvent', () => {

  test('should throw an error if event creation fails', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      const { error } = await supabase.from("events").insert({
        name: "Event Name",
        location: "Location",
        description: "Description",
        start: new Date(),
        end: new Date(),
        host_org: null,
        creator_id: user.id,
        category: ["Category"],
        geopoint: `SRID=4326;POINT(0 0)`
      }).select("id").single();

      if (error) {
        await expect(
          submitEvent("Event Name", "Location", "Description", new Date(), new Date(), null, ["Category"], 0, 0)
        ).rejects.toThrow(`Failed to create event: ${error.message}`);
      }
    }
  });

  test('should return event ID if event creation is successful', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      const { data, error } = await supabase.from("events").insert({
        name: "Event Name",
        location: "Location",
        description: "Description",
        start: new Date(),
        end: new Date(),
        host_org: null,
        creator_id: user.id,
        category: ["Category"],
        geopoint: `SRID=4326;POINT(0 0)`
      }).select("id").single();

      if (!error && data) {
        const eventId = await submitEvent(
          "Event Name",
          "Location",
          "Description",
          new Date(),
          new Date(),
          null,
          ["Category"],
          0,
          0
        );

        expect(eventId).toBe(data.id);
      }
    }
  });

  test('should throw an error if event start time is in the past', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      const pastDate = new Date(Date.now() - 86400000); // 1 day in the past
      await expect(
        submitEvent("Event Name", "Location", "Description", pastDate, new Date(), null, ["Category"], 0, 0)
      ).rejects.toThrow("Event start and end times cannot be in the past.");
    }
  });

  test('should throw an error if event end time is in the past', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      const pastDate = new Date(Date.now() - 86400000); // 1 day in the past
      await expect(
        submitEvent("Event Name", "Location", "Description", new Date(), pastDate, null, ["Category"], 0, 0)
      ).rejects.toThrow("Event start and end times cannot be in the past.");
    }
  });

  test('should throw an error if latitude or longitude is null', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user != null) {
      await expect(
        submitEvent("Event Name", "Location", "Description", new Date(), new Date(), null, ["Category"], null, null)
      ).rejects.toThrow("Please search for a valid address.");
    }
  });
});