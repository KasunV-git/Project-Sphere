const {
    connectTestDB,
    clearDatabase
} = require("./testDatabase");

beforeAll(async () => {

    await connectTestDB();

});

afterEach(async () => {

    await clearDatabase();

});