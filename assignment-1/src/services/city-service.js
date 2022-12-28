/* ----------------------------- ONCLICK ACTIONS ---------------------------- */

export default (forecastModel, dataModel, view) => {
    const onAction = async ({type, ...params}) =>  {
      switch(type) {

        /* --------------- ACTION REALATED WITH RELOADING DATA FOR SELECTED CITY -------------- */

        // ! Q5 (asynchronous)
        case `city-chagne`:
          const forecastUrl = params.wrapper.buildUrl(params.forecastEndpoint, params.place);
          params.wrapper.fetchFromApi(forecastUrl)
          .then((response) => {
            const updatedForecastModel = forecastModel.updateForecasts(response);
            view.updateForecast(updatedForecastModel);
          })
          .catch((error) => {
            console.log(`error`, error);
            view.displayMessage(`Cannot load forecast data!`);
          });
          
          const dataUrl = params.wrapper.buildUrl(params.dataEndpoint, params.place);
          params.wrapper.fetchFromApi(dataUrl)
          .then((response) => {
            const updatedDataModel = dataModel.updateWeather(response);
            view.updateWeather(updatedDataModel);
          })
          .catch((error) => {
            console.log(`error`, error);
            view.displayMessage(`Cannot load weather data!`);
          });
          break;
      }
    }
  
    return { onAction }
  }