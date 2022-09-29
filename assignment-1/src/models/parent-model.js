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

    return { getListByMeasurementType, getMeasurementTypes }
}

export default model;