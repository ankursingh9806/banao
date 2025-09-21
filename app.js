require('dotenv').config();

const express = require('express')
const app = express()
const userRoute = require("./userRoute")
const cors = require('cors');
const mongoose = require("./database")

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors())

app.use(userRoute)

mongoose.connection.once("open", () => {
    app.listen(3000, () => {
        console.log("app is connected to mongodb")
        console.log("server is running on port 3000")
    })
})
mongoose.connection.on("error", (err) => {
    console.error("error connecting to mongodb:", err)
})