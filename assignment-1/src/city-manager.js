/* ----------------------------- ONCLICK ACTIONS ---------------------------- */

export default (forecastModel, dataModel, view) => {
    const onAction = async ({type, ...params}) =>  {
      switch(type) {

        /* --------------- ACTION REALATED WITH RELOADING DATA FOR SELECTED CITY -------------- */

        case `city-chagne`:
          const forecastUrl = params.wrapper.buildUrl(params.forecastEndpoint, params.place);
          params.wrapper.fetchFromApi(forecastUrl).then((response) => {
            const updatedForecastModel = forecastModel.updateForecasts(response);
            view.updateForecast(updatedForecastModel);
          })
          
          const dataUrl = params.wrapper.buildUrl(params.dataEndpoint, params.place);
          params.wrapper.fetchFromApi(dataUrl).then((response) => {

            const updatedDataModel = dataModel.updateWeather(response);
            view.updateWeather(updatedDataModel);
          });
          break;

          case `add-data`:
            const dataPostUrl = params.wrapper.buildUrl(params.dataEndpoint, params.place);
            params.wrapper.postData(dataPostUrl, params.values);
      }
    }
  
    return { onAction }
  }