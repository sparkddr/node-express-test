module.exports = {
    testMatch: [
        "<rootDir>/tests/unit/**/*.test.ts",   // Cherche les tests unitaires
        "<rootDir>/tests/integration/**/*.test.ts" // Cherche les tests d'intégration
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    preset: "ts-jest",
    testEnvironment: "node"

};