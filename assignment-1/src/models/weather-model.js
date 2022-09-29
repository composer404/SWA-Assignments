import model from "./parent-model";

const dataModel = (data, filter = () => true) => {
    const parentModel = model();
    const getMinTemperatureForLastDay = () => {
        const filtered = data.filter((element) => {
            const elementDate = new Date(element.time);
            const now = new Date();
            return element.type === `temperature` && elementDate.getUTCDate() === now.getDate() - 1;
        });

        const minTemperature = Math.min(...filtered.map(element => {
            return element.value;
        }));

        return {
            minTemperature,
            minTemperatureUnit: filtered[0].unit,
        }
    } 

    const getMaxTemperatureForLastDay = () => {
        const filtered = data.filter((element) => {
            const elementDate = new Date(element.time);
            const now = new Date();
            return element.type === `temperature` && elementDate.getUTCDate() === now.getDate() - 1;
        });

        const maxTemperature = Math.max(...filtered.map(element => {
            return element.value;
        }));

        return {
            maxTemperature,
            maxTemperatureUnit: filtered[0].unit,
        }
    } 

    const getLastDayTemperatureRange = () => {
        const min = getMinTemperatureForLastDay();
        const max = getMaxTemperatureForLastDay();

        return Object.assign({}, min, max);
    }

    const getLastDayAsString = () => {
        const filtered = data.filter((element) => {
            const elementDate = new Date(element.time);
            const now = new Date();
            return element.type === `temperature` && elementDate.getUTCDate() === now.getDate() - 1;
        });
        
        const date = new Date(filtered[0].time)
        const dateAsString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return dateAsString;
    }

    const getLastDayTotalPreciptation = () => {
        // ! TODO
    };

    const getLastDayAverageSpeed = () => {
        // ! TODO
    };

    const getLastMeasurementEachKind = () => {
        const types = parentModel.getMeasurementTypes();
        return {
            temperature: parentModel.getListByMeasurementType(data, types.temperature)[0],
            cloud_coverage: parentModel.getListByMeasurementType(data, types.cloud_coverage)[0],
            precipitation: parentModel.getListByMeasurementType(data, types.precipitation)[0],
            wind_speed: parentModel.getListByMeasurementType(data, types.wind_speed)[0],
        }
    }

    const updateWeather = (f) => dataModel(f);
    
    return { updateWeather, getLastDayTemperatureRange, getLastDayAsString, getLastMeasurementEachKind, getLastDayTotalPreciptation, getLastDayAverageSpeed}
}

export default dataModel;


