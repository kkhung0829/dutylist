module.exports = {
    preset: 'ts-jest',
    setupFiles: ["dotenv/config"],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    runner: 'jest-serial-runner',
};