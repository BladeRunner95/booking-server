const mongoose = require('mongoose');
const colors = require('colors')

const connectDB = async () => {
    try {
      const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${connect.connection.host}`.bgGreen.underline);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;