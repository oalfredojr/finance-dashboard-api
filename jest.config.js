export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!(uuid|bcrypt)/)'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/db/postgres/migrations/**',
        '!src/**/*.test.js',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
