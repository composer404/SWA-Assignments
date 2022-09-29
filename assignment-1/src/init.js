import './styles.css';

import cityService from './services/city-service';
import dataModel from './models/weather-model';
import dataService from './services/data-service';
import forecastModel from './models/forecast-model';
import viewController from './controllers/view-controller';

/* ---------------- INITIALIZE ALL REQUIRED FACTORY FUNCTIONS --------------- */

const init = async () => {

    /* ------------------------------- models init ------------------------------ */

    const initForecastModel = forecastModel();
    const initDataModel = dataModel();

    /* ---------------------------- contollers inint ---------------------------- */

    const view = viewController(window);

    /* ------------------------------ service init ------------------------------ */

    const initCityService = cityService(initForecastModel, initDataModel, view);
    const initDataService = dataService(view);

    view.addDefaultListeners();
    view.listen(initCityService.onAction);
    view.listen(initDataService.onAction);

}

void init();