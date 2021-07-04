const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            keepAlive: 999999999999999,
            connectTimeoutMS: 1000
        });
        console.log("Database connected");
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;