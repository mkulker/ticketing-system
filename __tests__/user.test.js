const supabase = require('../setup').default;

describe('User existence test', () => {
  test('checks if a user already exists in the database', async () => {

    const emailToCheck = 'mkulker@umass.edu';

    // Query the database 
    const { data, error } = await supabase
      .from('users')
      .select()
      //.eq('email', emailToCheck);

    // Expect the data array to have a length > 0 if the user exists
    expect(data).not.toBeNull();
    expect(data.length).toBeGreaterThan(0);
    console.log(data);
  });
});