const express = require("express");
const app = express();
require("dotenv/config")

const cors = require("cors");
const mongoose = require("mongoose")

app.use(cors({ origin: true }))

// change form data to json


app.use(express.json())

app.get("/", (req, res) => {
    return res.json("Hii There.....")
})

// user authentication routes

const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// // Artist Routes
const artistsRoutes = require("./routes/artist")
app.use("/api/artists/", artistsRoutes)

// // Album Routes
const albumRoutes = require("./routes/albums")
app.use("/api/albums/", albumRoutes)

// // Songs Routes
const songRoutes = require("./routes/songs")
app.use("/api/songs/", songRoutes)




mongoose.connect(process.env.DB_STRING);

mongoose.connection.once("open", () => console.log("connected")).on("error", (error) => {
    console.log(`ERROR : ${error}`)
})

app.listen(4000, () => console.log("listening to port 4000"))

