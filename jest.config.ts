import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ["ts", "js"],
  rootDir: ".",
  preset: "ts-jest",
  testRegex: "\\.spec\\.ts$",
  testEnvironment: "node",
  forceExit: true,
  resetMocks: true,
};

export default config