"use client";

// Import necessary modules and initialize the Supabase client
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const EditEventPage = ({ params }: { params: { eventId: string } }) => {
  // Initialize the router for navigation
  const router = useRouter();
  
  // Extract the event ID from the URL
  const url = window.location.href;
  const strs = url.split("/");
  const eventId = strs[strs.length - 1];

  // Initialize state variables for event details, loading state, success message, and error message
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Define the available categories for the event
  const availableCategories = [
    "Concert",
    "Movie",
    "Play",
    "Athletics",
    "Conference",
    "Convention",
    "Other",
  ];

  // Fetch event details from the database when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        // Handle error if fetching event details fails
        console.error("Error fetching event:", error);
        setErrorMessage("Error fetching event.");
      } else {
        // Set the fetched event details to state variables
        setEventName(data.name || "");
        setDescription(data.description || "");
        setCategories(data.Category || []);
      }
      // Set loading to false after fetching event details
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  // Handle category selection changes
  const handleCategoryChange = (category: string) => {
    if (categories.includes(category)) {
      // Remove the category if it is already selected
      setCategories(categories.filter((cat) => cat !== category));
    } else {
      // Add the category if it is not already selected
      setCategories([...categories, category]);
    }
  };

  // Handle form submission to update the event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .update({
        name: eventName,
        description,
        Category: categories,
      })
      .eq("id", eventId);

    if (error) {
      // Handle error if updating event details fails
      console.error("Error updating event:", error);
      setErrorMessage("Error updating event.");
    } else {
      // Set success message and navigate to the events page after a delay
      setSuccessMessage("Event updated successfully!");
      setTimeout(() => {
        router.push("/events");
      }, 2000);
    }

    // Set loading to false after updating event details
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="font-semibold text-2xl mb-6">Edit Event</h2>
      {successMessage && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-md">
          {errorMessage}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border p-2 rounded-md"
            maxLength={20}
            required
          />
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
            {availableCategories.map((cat) => (
              <div key={cat} className="flex items-center">
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                  className="mr-2"
                />
                <label>{cat}</label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="border p-2 rounded-md bg-blue-500 text-white"
          >
            {loading ? "Updating Event..." : "Update Event"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditEventPage;