export default window => {
    const document = window.document;
    const listeners = [];

    /* ------------------------ HTML ELEMENTS DECLARATION ----------------------- */

    const forecastSection = document.getElementById(`forecast-section`);
    const horsensButton = document.getElementById(`horsens-button`);
    const aarhusButton = document.getElementById(`aarhus-button`);
    const copenhagenButton = document.getElementById(`copenhagen-button`);

    /* ---------------------------- VIEW MANIPULATION --------------------------- */

    const addForecast = (forecast) => {
        const forecastCard = document.createElement(`div`);
        forecastCard.classList.add('forecast-card');
        forecastCard.appendChild(document.createTextNode(`Temperature`));
        forecastCard.appendChild(document.createTextNode(`${forecast[`temperature`].from} - ${forecast[`temperature`].to}`));
        forecastCard.appendChild(document.createTextNode(`${forecast[`temperature`].from} - ${forecast[`temperature`].to}`));
        forecastSection.appendChild(forecastCard);
    };

    const updateForecast = (model) => {
        forecastSection.innerHTML = ``;
        const hourlyForecastMap = model.hourlyForecast();
        for(const key in hourlyForecastMap) {
            addForecast(hourlyForecastMap[key]);
        }
    }

    /* ----------------------------- LISTENERS ---------------------------- */

    const listen = (listener) => listeners.push(listener);

    const addDefaultListeners = () => {
        horsensButton.onclick = () => {
            const event = { type: `city-chagne`, place: `Horsens`,  endpoint: `forecast`};
            listeners.map((listener) => {
                listener(event);
            })
        }
    
        aarhusButton.onclick = () => {
            const event = { type: `city-chagne`, place: `Aarhus`, endpoint: `forecast`};
            listeners.map((listener) => {
                listener(event);
            })
        }
    
        copenhagenButton.onclick = () => {
            const event = { type: `city-chagne`, place: `Copenhagen`,  endpoint: `forecast`};
            listeners.map((listener) => {
                listener(event);
            })
        }
    }

    return { addForecast, listen, addDefaultListeners, updateForecast };
}