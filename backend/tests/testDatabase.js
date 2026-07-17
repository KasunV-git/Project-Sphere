const mongoose = require("mongoose");

const {
    MongoMemoryServer
} = require("mongodb-memory-server");

let mongoServer;

/**
 * Start temporary MongoDB
 */
const connectTestDB = async () => {

    mongoServer =
        await MongoMemoryServer.create();

    const uri =
        mongoServer.getUri();

    await mongoose.connect(uri);

};

/**
 * Clear all collections
 */
const clearDatabase = async () => {

    const collections =
        mongoose.connection.collections;

    for (const key in collections) {

        await collections[key].deleteMany();

    }

};

/**
 * Stop database
 */
const closeDatabase = async () => {

    await mongoose.connection.dropDatabase();

    await mongoose.connection.close();

    await mongoServer.stop();

};

module.exports = {

    connectTestDB,

    clearDatabase,

    closeDatabase

};