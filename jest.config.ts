import type {Config} from 'jest';

process.env = Object.assign(process.env, {
  ENV: "test"
})

const config: Config = {
  verbose: true,
  moduleFileExtensions: ["ts", "js"],
  rootDir: ".",
  preset: "ts-jest",
  testRegex: "\\.spec\\.ts$",
  testEnvironment: "node",
  forceExit: true,
  resetMocks: true,
  globalSetup: "<rootDir>/__tests__/test.setup.ts",
};

export default config