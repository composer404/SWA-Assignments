/* -------------------- GENERIC METHODS FOR FETCHING DATA -------------------- */


/* ---------------------------- FETCH COMMONALITIES  ---------------------------- */

const fetchCommon = {
    buildUrl: (endpoint, place) => {
        return `http://localhost:8080/${endpoint}`.concat(place ? [`/${place}`] : []);
    }
}

/* ------------------------ RECEIVING DATA WITH FETCH ----------------------- */

const fetchWrapper = {
    fetchFromApi: async (url) => {
        const response = await fetch(url);
        return response.json();
    },
    postData: async (url, body) => {
        const resposne = await fetch(url, {
            method: `POST`,
            body: JSON.stringify(body),
        });
        return resposne.json();
    }
}

Object.setPrototypeOf(fetchWrapper, fetchCommon);


/* --------------------- RECEIVING DATA WITH XMLREQUEST --------------------- */

const xmlRequestWrapper = {
    fetchFromApi: async (url) => {

    }
}

Object.setPrototypeOf(xmlRequestWrapper, fetchCommon);

export { fetchWrapper, xmlRequestWrapper };