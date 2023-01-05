/* ----------------------------- ONCLICK ACTIONS ---------------------------- */

export default (forecastModel, dataModel, view) => {
    const onAction = async ({type, ...params}) =>  {
      switch(type) {

        /* --------------- ACTION REALATED WITH RELOADING DATA FOR SELECTED CITY -------------- */

        // ! Q5 (2 - asynchronous) - enables program to start a potentially long-running task and still be able to be responsive to 
        // other events while that task runs, without freezing the browser.
        
        // Build the url, and on the wrapper we send a request to the API
        
        // ! Q5 (5 - then - a higher order function, taking place when the promise is resolved, once we know the value of the promise)
        // We receive the answer from the promise, update the model first and the view, if something goes wrong display an error.
        // Promise either resolves a value or rejects with an error. 
        // Then keyword can be used to chain the promises - once one of them is completed, the next one can be initiated, the order can be modified.
        case `city-chagne`:
          const forecastUrl = params.wrapper.buildUrl(params.forecastEndpoint, params.place);
          params.wrapper.fetchFromApi(forecastUrl)
          .then((response) => {
            const updatedForecastModel = forecastModel.updateForecasts(response);
            view.updateForecast(updatedForecastModel);
            // callback is done when the other function has finished. Executes the code in response to an event. Opposite to call.
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