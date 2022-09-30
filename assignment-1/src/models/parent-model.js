const model = () => {
    const getMeasurementTypes = () => {
        return {
            temperature: `temperature`,
            precipitation: `precipitation`,
            wind_speed: `wind speed`,
            cloud_coverage: `cloud coverage`,
        }
    };
    
    const getListByMeasurementType = (values, type) => {
        return values.filter((element) => {
            return element.type === type;
        }).sort((element, nextElement) => {
            return new Date(element.time) - new Date(nextElement.time);
        }).reverse();
    };

    const getMeasurementTypeForLastDay = (values, type) => {
        return values.filter((element) => {
            const elementDate = new Date(element.time);
            const now = new Date();
            return element.type === type && elementDate.getUTCDate() === now.getDate() - 1;
        });
    }

    return { getListByMeasurementType, getMeasurementTypes, getMeasurementTypeForLastDay }
}

export default model;