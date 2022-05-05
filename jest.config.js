module.exports = {
    verbose: true,
    preset: 'ts-jest',
    moduleDirectories: ["node_modules", "src"],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    testEnvironment: 'jsdom',
};