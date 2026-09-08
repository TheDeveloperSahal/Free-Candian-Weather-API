async function GettingURL (location) {
    const respsonse = await fetch(`${process.env.GEO_CODE_API}${encodeURIComponent(location)}`)
    const { results } = await respsonse.json();
    if (!results || results.length === 0) {
        throw new Error("Location not found");
    }
    const { latitude, longitude } = results[0];
    const url = `${process.env.WEB_URL}${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`
    return {url,latitude,longitude};
}
module.exports = GettingURL;