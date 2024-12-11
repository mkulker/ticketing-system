"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
// This is the edit event page
const EditEventPage = ({ params }: { params: { eventId: string } }) => {

    const router = useRouter();
    const url = window.location.href;
    const strs = url.split("/");
    const eventId = strs[strs.length-1];

    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

    const availableCategories = [
        "Concert",
        "Movie",
        "Play",
        "Athletics",
        "Conference",
        "Convention",
        "Other",
    ];

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
      } else {
        setEventName(data.name || "");
        setDescription(data.description || "");
        setCategories(data.category || []);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  const handleCategoryChange = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("events")
      .update({ name: eventName, description, category: categories })
      .eq("id", eventId);

    if (error) {
      console.error("Error updating event:", error);
    } else {
      setSuccessMessage("Event updated successfully!");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Event</h1>
      {successMessage && (
        <p className="bg-green-500 text-white p-2 rounded mb-4">
          {successMessage}
        </p>
      )}
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
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
          <h3 className="font-semibold">Categories</h3>
          {availableCategories.map((cat) => (
            <label key={cat} className="block">
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="border p-2 rounded-md bg-blue-500 text-white"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;