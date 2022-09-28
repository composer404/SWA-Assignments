/* ----------------------------- ONCLICK ACTIONS ---------------------------- */

import { fetchWrapper } from "./fetch";

export default (forecastModel, dataModel, view) => {
    const onAction = async ({type, ...params}) =>  {
      switch(type) {

        /* --------------- ACTION REALATED WITH RELOADING DATA FOR SELECTED CITY -------------- */

        case `city-chagne`:
          const forecastUrl = fetchWrapper.buildUrl(params.forecastEndpoint, params.place);
          fetchWrapper.fetchFromApi(forecastUrl).then((response) => {
            const updatedForecastModel = forecastModel.updateForecasts(response);
            view.updateForecast(updatedForecastModel);
          })
          
          const dataUrl = fetchWrapper.buildUrl(params.dataEndpoint, params.place);
          fetchWrapper.fetchFromApi(dataUrl).then((response) => {

            const updatedDataModel = dataModel.updateWeather(response);
            view.updateWeather(updatedDataModel);
          });
          break;

          case `add-data`:
            const dataPostUrl = fetchWrapper.buildUrl(params.dataEndpoint, params.place);
            fetchWrapper.postData(dataPostUrl, params.values);
      }
    }
  
    return { onAction }
  }