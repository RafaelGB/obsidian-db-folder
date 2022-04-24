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
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "node_modules/(.*)": "<rootDir>/node_modules/$1",
    "obsidian-dataview": "<rootDir>/node_modules/obsidian-dataview/lib/index.js"
  },
  transform: {
    "^.+\\.svelte$": [
    "svelte-jester",
    {
      "preprocess": true
    }
    ],
    "^.+\\.ts$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleDirectories: ["node_modules", "src"],
};