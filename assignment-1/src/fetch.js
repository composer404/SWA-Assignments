/* -------------------- GENERIC METHOD FOR FETCHING DATA -------------------- */

const fetchData = async (endpoint, place) => {
    let url = `http://localhost:8080/${endpoint}`

    if (place) {
        url += `/${place}`
    }

    const response = await fetch(url);
    return response.json();
}

export default fetchData;