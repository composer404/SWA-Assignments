export default window => {
    const document = window.document;
    const listeners = [];

    /* ------------------------ HTML ELEMENTS DECLARATION ----------------------- */

    const forecastSection = document.getElementById(`forecast-section`);
    const weatherSection = document.getElementById('weather-section;')
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

    const updateForecast = (forecastModel) => {
        forecastSection.innerHTML = ``;
        const hourlyForecastMap = forecastModel.hourlyForecast();
        for(const key in hourlyForecastMap) {
            addForecast(hourlyForecastMap[key]);
        }
    };

    const addWeather = (data) => {
        const weatherCard = document.createElement(`div`);
        weatherCard.classList.add('weather-card');
        weatherCard.appendChild(document.createTextNode(`Temperature`));
        weatherCard.appendChild(document.createTextNode(`${data[`temperature`].value}` ));
        weatherCard.appendChild(document.createTextNode(`${data[`temperature`].value}`));
        weatherSection.appendChild(weatherCard);
        };
        

    const updateWeather1 = (dataModel) => {
        weatherSection.innerHTML = ``;
        const historicalMeasurementsMap = dataModel.historicalMeasurements();
        for(const key in historicalMeasurementsMap) {
           addWeather (historicalMeasurementsMap[key]);
        }
    };

    

    /* ----------------------------- LISTENERS ---------------------------- */

    const listen = (listener) => listeners.push(listener);

    const addDefaultListeners = () => {
        horsensButton.onclick = () => {
            const event = { type: `city-chagne`, place: `Horsens`, forecastEndpoint: 'forecast', dataEndpoint: 'data'}; 
            listeners.map((listener) => {
                listener(event);
            })
        }
    
        aarhusButton.onclick = () => {
            const event = { type: `city-chagne`, place: `Aarhus`, forecastEndpoint: 'forecast', dataEndpoint: 'data' };
            listeners.map((listener) => {
                listener(event);
            })
        }
    
        copenhagenButton.onclick = () => {
            const event = { type: `city-chagne`, place: `Copenhagen`,  forecastEndpoint: 'forecast', dataEndpoint: 'data'};
            listeners.map((listener) => {
                listener(event);
            })
        }
    }

    return { addForecast, listen, addDefaultListeners, updateForecast,addWeather,updateWeather1}; 
}