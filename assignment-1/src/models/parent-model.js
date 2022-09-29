const model = () => {
    const mapValuesByDate = (values) => {
        const mapedValues = {}
        values
        .map((value) => {
        mapedValues[value.time] = {
            ...mapedValues[value.time],
            [value.type]: value,
        };
        }).sort();
        return mapedValues;
    }
    
    const updateModelValue = (model, value) => {
        model(value);
        // return Object.create(model(), defaultModel(value));
    }

    return { mapValuesByDate, updateModelValue }
}

export default model;