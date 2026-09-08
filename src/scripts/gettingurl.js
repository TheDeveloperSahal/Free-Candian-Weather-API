async function GettingURL (location) {
    const respsonse = await fetch(`${process.env.GEO_CODE_API}${encodeURIComponent(location)}`)
    const { results: [{latitude,longitude}]} = await respsonse.json();
    const url = `${process.env.WEB_URL}${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}`
    return {url,latitude,longitude};
}
module.exports = GettingURL;