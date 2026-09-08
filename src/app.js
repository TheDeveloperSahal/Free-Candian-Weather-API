const express = require('express');
const Intializer = require("./scripts/intiliazer.js");
const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    const { location } = await req.query;

    if (!location) {
        return res.status(400).json({
            message: "Location Not Found",
        })
    }
    await Intializer(location)
    .then((final_data) => {
        res.status(200).json(final_data)
    })
    .catch((err) => {
        console.log(err.message);
        res.status(500).json({
            message: err.message || "Error fetching weather data",
        })
    })
})


module.exports = app;