import { fetchWrapper, xmlRequestWrapper } from "../utils/fetch";

import { DateTime } from "luxon";

export default window => {
    const document = window.document;
    const listeners = [];
    let selectedApiWrapper = fetchWrapper;

    /* ------------------------ HTML ELEMENTS DECLARATION ----------------------- */

    // Sections
    const forecastSection = document.getElementById(`forecast-section`);
    const weatherSection = document.getElementById('weather-section');
    const latestSection = document.getElementById('latest-section');

    // Buttons
    const horsensButton = document.getElementById(`horsens-button`);
    const aarhusButton = document.getElementById(`aarhus-button`);
    const copenhagenButton = document.getElementById(`copenhagen-button`);
    const createButton = document.getElementById(`create-button`);
    const fetchButton = document.getElementById(`fetch-button`);
    const xmlButton = document.getElementById(`xml-button`);

    // Other elements
    const header = document.getElementById(`header`);
    const weatherSectionTitle = document.getElementById(`weather-section-title`);
    const latestSectionTitle = document.getElementById(`latest-section-title`);
    const forecastSectionTitle = document.getElementById(`forecast-section-title`);
    const addDataForm = document.getElementById(`add-data-form`);

    /* ------------------------ VIEW MANIPULATION GENERAL ----------------------- */

    const displayMessage = (message) => {
        alert(message);
    };

    /* ------------------------ VIEW MANIPULATION WEATHER ----------------------- */

    const updateWeather = (weatherModel) => {
        weatherSection.innerHTML = ``;
        addDataForm.style.display = `none`;
        displayLastTemperatureRange(weatherModel);
        displayLatestMeasurement(weatherModel);
        displayAverageWind(weatherModel);
        displayTotalPrecipitation(weatherModel);
    }

    const displayAverageWind = (weatherModel) => {
        const avr = weatherModel.getLastDayAverageWindSpeed();

        weatherSection.appendChild(createCardWithData([{
            label: `Wind Speed`,
            value: `${avr.averageWindSpeed}${avr.unit}`
        }]));
    };

    const displayTotalPrecipitation = (weatherModel) => {
        const total = weatherModel.getLastDayTotalPrecipitation();

        weatherSection.appendChild(createCardWithData([{
            label: `Precipitation`,
            value: `${total.totalPrecipitation}${total.unit}`
        }]));
    };

    const displayLatestMeasurement = (weatherModel) => {
        latestSection.innerHTML = ``;
        const latestMeasurement =  weatherModel.getLastMeasurementEachKind()
        latestSectionTitle.innerHTML = `Latest measurements`;

        for(const type in latestMeasurement) {
            const values = latestMeasurement[type];

            switch(type) {
                case `temperature`: {
                    latestSection.appendChild(createCardWithData([
                        {
                            label: `Temperature`,
                        },
                        {
                            label: `Value`,
                            value: `${values.value} &#176;${values.unit}`,
                        },
                        {
                            label: `Time`,
                            value: DateTime.fromISO(values.time).toFormat(`dd/MM/yyyy HH:mm`),
                        }
                    ]));
                    break;
                }

                case `wind_speed`: {
                    latestSection.appendChild(createCardWithData([
                        {
                            label: `Wind speed`,
                        },
                        {
                            label: `Value`,
                            value: `${values.value} ${values.unit}`,
                        },
                        {
                            label: `Direction`,
                            value: `${values.direction}`,
                        },
                        {
                            label: `Time`,
                            value: DateTime.fromISO(values.time).toFormat(`dd/MM/yyyy HH:mm`),
                        }
                    ]));
                    break;
                }

                case `precipitation`: {
                    latestSection.appendChild(createCardWithData([
                        {
                            label: `Precipitation`,
                        },
                        {
                            label: `Value`,
                            value: `${values.value} ${values.unit}`,
                        },
                        {
                            label: `Type`,
                            value: `${values.precipitation_type}`,
                        },
                        {
                            label: `Time`,
                            value: DateTime.fromISO(values.time).toFormat(`dd/MM/yyyy HH:mm`),
                        }
                    ]));
                    break;
                }

                case `cloud_coverage`: {
                    latestSection.appendChild(createCardWithData([
                        {
                            label: `Cloud coverage`,
                        },
                        {
                            label: `Value`,
                            value: `${values.value} ${values.unit}`,
                        },
                        {
                            label: `Time`,
                            value: DateTime.fromISO(values.time).toFormat(`dd/MM/yyyy HH:mm`),
                        }
                    ]));
                    break;
                }
            }
        }
    }

    const createCardWithData = (data, styleClass) => {
        const card = document.createElement(`div`);
        card.classList.add(`${styleClass ? styleClass : 'card'}`);
        let htmlString = ``
        data.forEach((element) => {
            htmlString += `<div class="item">`;
            htmlString += `<label>${element.label || ``}</label>`;
            htmlString += `<div>${element.value || ``}</div>`;
            htmlString += `</div>`;
        });
        card.innerHTML = htmlString;
        return card;
    }
        
    const displayLastTemperatureRange = (weatherModel) => {
        const range = weatherModel.getLastDayTemperatureRange();
        const lastDay = weatherModel.getLastDayAsString();

        weatherSectionTitle.innerHTML = `Weather (Last day: ${lastDay})`;
        weatherSection.appendChild(createCardWithData([{
            label: `Minimim Temperature`,
            value: `${range.minTemperature}  &#176;${range.minTemperatureUnit}`
        },
        {
            label: `Maximum Temperature`,
            value: `${range.maxTemperature}  &#176;${range.maxTemperatureUnit}`
        }]));
    }

    /* ---------------------------- VIEW MANIPULATION FORECAST --------------------------- */

    const updateForecast = (forecastModel) => {
        addDataForm.style.display = `none`;
        forecastSection.innerHTML = ``;
        forecastSectionTitle.innerHTML = `Forecast`
        const hourlyForecastMap = forecastModel.hourlyForecast();
        for(const key in hourlyForecastMap) {
            addForecast(hourlyForecastMap[key], key);
        }
    };

    const addForecast = (forecast, date) => {
        forecastSection.appendChild(createCardWithData([
            {
                label: `Date`,
                value: DateTime.fromISO(date).toFormat(`dd/MM/yyyy HH:mm`),
            },
            {
                label: `Temperature`,
                value: `${forecast[`temperature`].from}  &#176;${forecast[`temperature`].unit} - ${forecast[`temperature`].to} &#176;${forecast[`temperature`].unit}`,
            },
            {
                label: `Cloud coverage`,
                value: `${forecast[`cloud_coverage`].from }${forecast[`cloud_coverage`].unit} - ${forecast[`cloud_coverage`].to}${forecast[`cloud_coverage`].unit}`
            },
            {
                label: `Precipitation`,
                value: `${forecast[`precipitation`].from }${forecast[`precipitation`].unit} - ${forecast[`precipitation`].to}${forecast[`precipitation`].unit} (${forecast[`precipitation`].precipitation_types.toString().replaceAll(`,`, `, `)})`
            },
            {
                label: `Wind speed`,
                value: `${forecast[`wind_speed`].from }${forecast[`wind_speed`].unit} - ${forecast[`wind_speed`].to}${forecast[`wind_speed`].unit} (${forecast[`wind_speed`].directions.toString().replaceAll(`,`, `, `)})`
            }
        ], `forecast-card`));

    };

    /* ----------------------------- LISTENERS ---------------------------- */

    const listen = (listener) => listeners.push(listener);

    const addDefaultListeners = () => {
        horsensButton.onclick = () => {
            header.textContent = `Horsens`;
            const event = { type: `city-chagne`, wrapper: selectedApiWrapper, place: `Horsens`, forecastEndpoint: 'forecast', dataEndpoint: 'data'}; 
            listeners.map((listener) => {
                listener(event);
            })
        };
    
        aarhusButton.onclick = () => {
            header.textContent = `Aarhus`;
            const event = { type: `city-chagne`, wrapper: selectedApiWrapper, place: `Aarhus`, forecastEndpoint: 'forecast', dataEndpoint: 'data' };
            listeners.map((listener) => {
                listener(event);
            })
        };
    
        copenhagenButton.onclick = () => {
            header.textContent = `Copenhagen`;
            const event = { type: `city-chagne`, wrapper: selectedApiWrapper, place: `Copenhagen`,  forecastEndpoint: 'forecast', dataEndpoint: 'data'};
            listeners.map((listener) => {
                listener(event);
            })
        };

        xmlButton.onclick = () => {
            selectedApiWrapper = xmlRequestWrapper;
            xmlButton.classList.add(`selected-button`);
            fetchButton.classList.remove(`selected-button`);
        };

        fetchButton.onclick = () => {
            selectedApiWrapper = fetchWrapper;
            fetchButton.classList.add(`selected-button`);
            xmlButton.classList.remove(`selected-button`);
        };

        createButton.onclick = () => {
            weatherSection.innerHTML = ``;
            forecastSection.innerHTML = ``;
            latestSection.innerHTML = ``;

            latestSectionTitle.innerHTML = ``;
            weatherSectionTitle.innerHTML = ``;
            forecastSectionTitle.innerHTML = ``;
            header.innerHTML = ``;

            addDataForm.style.display = `block`;
        };

        addDataForm.addEventListener(`submit`, (e) => {
            const event = {
                type: `add-data`,
                dataEndpoint: 'data',
                wrapper: selectedApiWrapper,
                values: {
                    type: addDataForm.elements[`type`].value,
                    place: addDataForm.elements[`place`].value,
                    value: addDataForm.elements[`value`].value,
                    unit: addDataForm.elements[`unit`].value,
                }
            }
            listeners.map((listener) => {
                listener(event);
            })
            e.preventDefault();
            e.stopImmediatePropagation();
        });
    }

    return { listen, addDefaultListeners, updateForecast, updateWeather, displayMessage}; 
}