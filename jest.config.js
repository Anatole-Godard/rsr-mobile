// const { pathsToModuleNameMapper } = require("ts-jest");
// // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// // which contains the path mapping (ie the `compilerOptions.paths` option):
// const { compilerOptions } = require("./tsconfig");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["."],
  rootDir: ".",
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  testPathIgnorePatterns: [
    "node_modules",
    ".expo",
    "pages",
    "stacks",
  ],
  coverageReporters: ["html", "text-summary"],
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
//     prefix: "<rootDir>/",
//   }),
};