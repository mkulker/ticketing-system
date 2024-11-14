module.exports = {
  testMatch: ["**/__tests__/*.test.js"], // Maybe edit this line
  transform: {
     "^.+\\.js$": "babel-jest",
  },
  setupFiles: ["<rootDir>/.jest/env.js"],
};