const GeoCoder = require('node-geocoder');
async function GetCountry(latitude,longitude) {
    const geocoder = GeoCoder({ provider: "openstreetmap" });
    const [{country,state}] = await geocoder.reverse({
        lat: latitude,
        lon: longitude
    })
    return {country,state};
}
module.exports = GetCountry;