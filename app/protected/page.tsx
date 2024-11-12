import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Hero from "@/components/hero";

export default async function ProtectedPage() {
  return (
    <>
      <Hero />
    </>
  );
}
