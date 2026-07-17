const {
    closeDatabase
} = require("./testDatabase");

afterAll(async () => {

    await closeDatabase();

});