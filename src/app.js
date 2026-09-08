const express = require('express');
const Intializer = require("./scripts/intiliazer.js");
const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    const { location } = await req.query;

    if (!location) {
        res.status(200).json({
            message: "Location Not found",
        })
    }
    await Intializer(location)
    .then((final_data) => {
        res.status(200).json(final_data)
    })
    .catch((err) => {
        console.log(err);
    })
})


module.exports = app;