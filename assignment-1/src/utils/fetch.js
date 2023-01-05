/* -------------------- GENERIC METHODS FOR FETCHING DATA -------------------- */


/* ---------------------------- FETCH COMMONALITIES  ---------------------------- */

const fetchCommon = {
    buildUrl: (endpoint, place) => {
        return `http://localhost:8080/${endpoint}`.concat(place ? [`/${place}`] : []);
    }
}

/* ------------------------ RECEIVING DATA WITH FETCH ----------------------- */

// ! Q2 (Prototypal inheritance) - used to add methods and properties in objects with a prototype chain. 
// Allows to assign a prototype to a certain object - to the fetch wrapper, we assign fetch common as its prototype
// Thanks to that we have a newly created prototype that might be used.

// ! Q6 (fetch) - uses the promises to avoid the callback hell - callbacks whin callbacks.
// Fetch sends a request to the api to retrieve the data from the server. 

// ! Q5 (3 - request) - the place where the asynchronous process begins using async and await.
// Await allows to wait until the value of promise is returned.
// Await is used to unwrap promises by passing a Promise as the expression 

const fetchWrapper = {
    // async - declares a function where the await keyword is permitted within the function body on a certain promise 
    fetchFromApi: async (url) => {
        console.log(`Fetch is used`);
        const response = await fetch(url);
        return response.json();
        // return response with the json format
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

// ! Q6 (xmlHttpRequest) - uses the callback that handles the responses.
// XMLHttpRequest object is used to retrieve data from a server asynchronously.

// ! Q5 (4 - promise) - is a proxy for a value, not necessairly known, when the promise is created.

const xmlRequestWrapper = {
    fetchFromApi: (url) => {
        console.log(`XMLHttpRequest is used`);
        const request = new XMLHttpRequest();

        const promise = new Promise((resolve) => {
            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            }

            request.onerror = () => {
                reject(new Error('Request error'));
            }
        });

        request.open(`GET`, url);
        request.send();
        return promise;
    },

    postData: (url, body) => {
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

// Object.setPrototypeOf(xmlRequestWrapper, fetchCommon);

export { fetchWrapper, xmlRequestWrapper, fetchCommon };