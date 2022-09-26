import fetchData from "./fetch"

/* ----------------------------- ONCLICK ACTIONS ---------------------------- */

export default (forecastModel,dataModel,view) => {
    const onAction = async ({type, ...params}) =>  {
      switch(type) {

        /* --------------- ACTION REALATED WITH RELOADING DATA FOR SELECTED CITY -------------- */

        case 'city-chagne':
            fetchData(params.forecastEndpoint, params.place).then((value) => {
                const updatedForecastModel = forecastModel.updateForecasts(value);
                view.updateForecast(updatedForecastModel);
            });
            
        fetchData(params.dataEndpoint, params.place).then((value) => {
            const updatedDataModel = dataModel.updateWeather(value);
            view.updateWeather1(updatedDataModel);
        });

          break;
      }
    }
  
    return { onAction }
  }