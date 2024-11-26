const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/water_monitoring';

// Kết nối với cơ sở dữ liệu MongoDB bằng Mongoose
async function connectDB() {
    // Kết nối MongoDB
    mongoose.connect('mongodb://localhost:27017/water_level_system', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.once('open', () => console.log('Connected to MongoDB'));
}

module.exports = connectDB;
