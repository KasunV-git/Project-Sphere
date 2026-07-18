module.exports = {

    testEnvironment: "node",

    verbose: true,

    testTimeout: 30000,

    setupFilesAfterEnv: [

        "<rootDir>/tests/setup.js",

        "<rootDir>/tests/teardown.js"

    ],

    collectCoverageFrom: [

        "controllers/**/*.js",

        "middleware/**/*.js",

        "routes/**/*.js",

        "services/**/*.js"

    ]

};