const { config } = require("dotenv");
const GettingURL = require("./gettingurl");
const DataCleaner = require('./DataCleaner');

async function Intializer(location) {
    let final_data;
    config();
    const { url, latitude, longitude } = await GettingURL(location);
    await fetch(url)
        .then(async (blob) => {
            await DataCleaner(blob, latitude, longitude)
                .then(([data]) => {
                    final_data = data;
                })
                .catch((err) => {
                    throw err;
                })
        })
        .catch((err) => {
            throw err;
        })
    return final_data;
}
module.exports = Intializer;