import './styles.css';

import cityManager from './city-manager';
import dataModel from './weather-model';
import forecastModel from './forecast-model';
import viewManager from './view-manager';

/* ---------------- INITIALIZE ALL REQUIRED FACTORY FUNCTIONS --------------- */

const init = async () => {
    const initForecastModel = forecastModel();
    const initDataModel= dataModel();
    const view = viewManager(window);
    const city = cityManager(initForecastModel,initDataModel,view); 

    
    view.addDefaultListeners();
    view.listen(city.onAction);
}

void init();