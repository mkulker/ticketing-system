require("dotenv").config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// const supabase = require('../setup').default;

describe('Event existence test', () => {
  test('checks if an event already exists in the database', async () => {

    const eventToCheck1 = 'Demo Event 1';
    const eventToCheck2 = 'eventThatDoesntExist';

    // Query the database 
    const { data: data1, error: error1 } = await supabase
      .from('events')
      .select()
      .eq('name', eventToCheck1);

    const { data: data2, error: error2 } = await supabase
        .from('events')
        .select()
        .eq('name', eventToCheck2);


    // Expect the data array to have a length > 0 if the event exists
    expect(data1).not.toBeNull();
    expect(data1.length).toBeGreaterThan(0);

    // Expect the data array to be empty if the event does not exist
    expect(data2).toEqual([]);
    //console.log(data1);
  });
});