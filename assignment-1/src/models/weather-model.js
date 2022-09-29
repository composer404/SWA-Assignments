const measurementType = {
    temperature: `temperature`,
    precipitation: `precipitation`,
    wind_speed: `wind speed`,
    cloud_coverage: `cloud coverage`,
};


const dataModel = (data, filter = () => true) => {
    // const historicalMeasurements = () => {
    //     const wMap = {}
    //     weather
    //     .map((data) => {
    //     wMap[data.time] = {
    //         ...wMap[data.time],[data.type]: data,
    //     };
    //     }).sort().filter(filter);
    //     return wMap;
    // }
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

    const getListByMeasurementType = (type) => {
        return data.filter((element) => {
            return element.type === type;
        }).sort((element, nextElement) => {
            return new Date(element.time) - new Date(nextElement.time);
        }).reverse();
    }

    const getLastMeasurementEachKind = () => {
        return {
            temperature: getListByMeasurementType(measurementType.temperature)[0],
            cloud_coverage: getListByMeasurementType(measurementType.cloud_coverage)[0],
            precipitation: getListByMeasurementType(measurementType.precipitation)[0],
            wind_speed: getListByMeasurementType(measurementType.wind_speed)[0],
        }
    }

    const updateWeather = (f) => dataModel(f);
    
    return { updateWeather, getLastDayTemperatureRange, getLastDayAsString, getLastMeasurementEachKind }
}

export default dataModel;


