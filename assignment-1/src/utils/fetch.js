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
        console.log(`Fetch is used`);
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
        console.log(`XMLHttpRequest is used`);
        const request = new XMLHttpRequest();

        const promise = new Promise((resolve) => {
            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            }
        });

        request.open(`GET`, url);
        request.send();
        return promise;
    },

    postData: async (url, body) => {
        const request = new XMLHttpRequest();

        const promise = new Promise((resolve) => {
            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            }
        });

        request.open(`POST`, url, );
        request.send(JSON.stringify(body));
        return promise;
    },
}

Object.setPrototypeOf(xmlRequestWrapper, fetchCommon);

export { fetchWrapper, xmlRequestWrapper };