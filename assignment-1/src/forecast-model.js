const forecastModel = (forecasts, filter = () => true) => {
    const hourlyForecast = () => {
        const forecastHourMap = {}
        forecasts
        .map((forecast) => {
        forecastHourMap[forecast.time] = {
            ...forecastHourMap[forecast.time],
            [forecast.type]: forecast,
        };
        }).sort().filter(filter);
        return forecastHourMap;
    }

    const updateForecasts = (f) => forecastModel(f);

    return { hourlyForecast, updateForecasts }
}

export default forecastModel;