const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: [
        'src',
    ],
    testMatch: [
        '**/*.test.ts',
    ],
};