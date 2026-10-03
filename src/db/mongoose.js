const mongoose = require('mongoose')

const connectDatabase = async () => {
    const url = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/crud-api-task'
    await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 })
    console.log('Connected to MongoDB successfully')
}

module.exports = connectDatabase
