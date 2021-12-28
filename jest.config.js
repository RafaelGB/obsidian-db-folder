module.exports = {
    'transform': {
        "^.+\\.tsx?$": "ts-jest",
    },
    'roots': [
        '<rootDir>/src'
    ],
    'testRegex': "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    'testPathIgnorePatterns': ["/devops/", "/node_modules/"],
    'moduleDirectories': ["node_modules", "src"],
    'moduleFileExtensions': ["ts", "tsx", "js", "jsx", "json", "node"],
    'collectCoverage': true
}