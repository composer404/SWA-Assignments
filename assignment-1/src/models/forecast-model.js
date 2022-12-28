import { model } from "./parent-model";

const forecastModel = (forecasts) => {
    const parentModel = model();

    const hourlyForecast = () => {
        const forecastHourMap = {}
        forecasts.map((forecast) => { 
            forecastHourMap[forecast.time] = forecast;
        });

        const types = parentModel.getMeasurementTypes();
        
        for(const key in forecastHourMap) {
            forecastHourMap[key] = {
                temperature: parentModel.getListByMeasurementType(forecasts, types.temperature).filter((element) => {
                    return element.time === key;
                })[0],
                cloud_coverage: parentModel.getListByMeasurementType(forecasts, types.cloud_coverage).filter((element) => {
                    return element.time === key;
                })[0],
                precipitation: parentModel.getListByMeasurementType(forecasts, types.precipitation).filter((element) => {
                    return element.time === key;
                })[0],
                wind_speed: parentModel.getListByMeasurementType(forecasts, types.wind_speed).filter((element) => {
                    return element.time === key;
                })[0],
            }
        }

        return forecastHourMap;
    }

    const updateForecasts = (f) => forecastModel(f);

    return { hourlyForecast, updateForecasts }
}

export default forecastModel;