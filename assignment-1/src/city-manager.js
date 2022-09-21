import fetchData from "./fetch"

/* ----------------------------- ONCLICK ACTIONS ---------------------------- */

export default (model, view) => {
    const onAction = async ({type, ...params}) =>  {
      switch(type) {

        /* --------------- ACTION REALATED WITH RELOADING DATA FOR SELECTED CITY -------------- */

        case 'city-chagne':
            fetchData(params.endpoint, params.place).then((value) => {
                const updatedModel = model.updateForecasts(value);
                view.updateForecast(updatedModel);
            });
          break;
      }
    }
  
    return { onAction }
  }