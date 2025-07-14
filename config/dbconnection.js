const mongoose = require("mongoose");

require("dotenv").config()
const dburl = process.env.DB_URL

const db = async()=>{
    try {
        await mongoose.connect(dburl)
        console.log("database connected successfully")
    } catch (error) {
        console.log("database connection failed", error.messsage);
    }
}

module.exports = db