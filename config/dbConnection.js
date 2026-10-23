const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
}

connectDB()
    .then(() => console.log("DB Connected..."))
    .catch((err) => console.log(err))

module.exports = connectDB