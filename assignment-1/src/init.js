import './styles.css';

import cityManager from './city-manager';
import dataModel from './weather-model';
import forecastModel from './forecast-model';
import viewManager from './view-manager';

// import model from './parent-model';


// import { fetchCommon, fetchData, fetchWithXML } from './fetch'







/* ---------------- INITIALIZE ALL REQUIRED FACTORY FUNCTIONS --------------- */

const init = async () => {
    // const parentModel = model();

    // const initfetchCommon = fetchCommon();
    // const initfetchData = fetchData();
    // const initfetchWithXML = fetchWithXML();

    // Object.setPrototypeOf(initfetchData, initfetchCommon);
    // Object.setPrototypeOf(initfetchWithXML, initfetchData);

    const initForecastModel = forecastModel();
    const initDataModel = dataModel();

    // Object.setPrototypeOf(initForecastModel, parentModel);
    // Object.setPrototypeOf(initDataModel, parentModel);

    const view = viewManager(window);
    const city = cityManager(initForecastModel, initDataModel, view);

    view.addDefaultListeners();
    view.listen(city.onAction);
}

void init();