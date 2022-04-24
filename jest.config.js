module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: ".",
  roots: [
    "<rootDir>",
    "<rootDir>/src/",
    "<rootDir>/node_modules/"
  ],
  modulePaths: [
    "<rootDir>",
    "<rootDir>/src",
    "<rootDir>/node_modules"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleDirectories: ["node_modules", "src"],
};