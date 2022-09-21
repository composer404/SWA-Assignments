import './styles.css';

import cityManager from './city-manager';
import model from './forecast-model';
import viewManager from './view-manager';

/* ---------------- INITIALIZE ALL REQUIRED FACTORY FUNCTIONS --------------- */

const init = async () => {
    const initModel = model();
    const view = viewManager(window);
    const city = cityManager(initModel, view);

    view.addDefaultListeners();
    view.listen(city.onAction);
}

void init();