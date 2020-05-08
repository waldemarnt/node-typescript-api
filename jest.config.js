const { resolve } = require('path');
const root = resolve(__dirname);
module.exports = {
  rootDir: root,
  displayName: "root-tests",
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  testEnvironment: "node",
  clearMocks: true,
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
}
