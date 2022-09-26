const dataModel = (data, filter = () => true) => {
    const historicalMeasurements = () => {
        const wMap = {}
        weather
        .map((data) => {
        wMap[data.time] = {
            ...wMap[data.time],[data.type]: data,
        };
        }).sort().filter(filter);
        return wMap;
    }
  
    const minTemp = () => {
        const wMap = {}
        weather
        .map((data) => {
        wMap[data.time] = {
            ...wMap[data.time],[data.temperature]: data,
        };
        }).sort().filter(filter).min();
        return wMap;
    }
    // const minTemp = Math.min(...data.temperature)
    //  console.log(minTemp)
    const updateWeather = (f) => dataModel(f);
    return { historicalMeasurements, updateWeather, minTemp}
}

export default dataModel;


