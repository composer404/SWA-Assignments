import model from "./parent-model";

const dataModel = (data, filter = () => true) => {
    const parentModel = model();
    const getMinTemperatureForLastDay = () => {
        const values = parentModel.getMeasurementTypeForLastDay(data, `temperature`);
        const minTemperature = Math.min(...values.map(element => {
            return element.value;
        }));

        return {
            minTemperature,
            minTemperatureUnit: values[0].unit,
        }
    } 

    const getMaxTemperatureForLastDay = () => {
        const values = parentModel.getMeasurementTypeForLastDay(data, `temperature`);
        const maxTemperature = Math.max(...values.map(element => {
            return element.value;
        }));

        return {
            maxTemperature,
            maxTemperatureUnit: values[0].unit,
        }
    } 

    const getLastDayTemperatureRange = () => {
        const min = getMinTemperatureForLastDay();
        const max = getMaxTemperatureForLastDay();

        return Object.assign({}, min, max);
    }

    const getLastDayAsString = () => {
        const values = parentModel.getMeasurementTypeForLastDay(data, `temperature`);
        const date = new Date(values[0].time)
        const dateAsString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return dateAsString;
    }

    const getLastDayTotalPrecipitation = () => {
        const values = parentModel.getMeasurementTypeForLastDay(data, `precipitation`);
        let totalPrecipitation = 0;
        values.map((element) => {
            totalPrecipitation += element.value;
        });

        return {
            totalPrecipitation: totalPrecipitation.toFixed(2),
            unit: values[0].unit,
        }
    };

    const getLastDayAverageWindSpeed = () => {
        const values = parentModel.getMeasurementTypeForLastDay(data, `wind speed`);
        const averageWindSpeed = (values.reduce((a, b) => a + b.value, 0) / values.length).toFixed(2);

        return {
            averageWindSpeed,
            unit: values[0].unit,
        }
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
    
    return { updateWeather, getLastDayTemperatureRange, getLastDayAsString, getLastMeasurementEachKind, getLastDayTotalPrecipitation, getLastDayAverageWindSpeed}
}

export default dataModel;


