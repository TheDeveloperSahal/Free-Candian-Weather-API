const tzlookup = require('tz-lookup');
async function getTimeZone(latitude,longitude) {
    const timezone = tzlookup(latitude,longitude)
    return timezone;
}
module.exports = getTimeZone;