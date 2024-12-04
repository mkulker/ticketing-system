const { describe } = require("node:test");

/**
 * Testing the test environment
 */
describe("Testing the test environment", () => {
  test("Sample Test 1", () => {
    expect(true).toBe(true);
  });

  test("Sample Test 2", () => {
    expect(false).toBe(false);
  });
});
