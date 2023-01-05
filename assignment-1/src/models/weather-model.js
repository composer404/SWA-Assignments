import { ModelConstructor, model } from "./parent-model";

// ! Q1 (Constructor function usage and prototype - an object, where it can add new variables and methods to the existing object)
// Prototype is a base class for all the objects, and it helps us to achieve the inheritance. Allows to add new properties and methods to arrays.
// If the object from a prototype gets modified it means that value for each object gets changed.

// The constructor finds the context using this, returning an object when the new is used. It creates an object that comes with 2 get functions.
// New model constructor returns an object created with a constructor function. An object has an automatically assigned prototype.
// That is enriched with the functionality from the Parent Model. ()
// The runtime model will use the following functionality
// Constructor function is useful when we need to create a couple of objects that have some of the same properties
// In case when the object extension is needed, it is possible to use the constructor directly.
// The constructor does not return an object, it creates an object.

const dataModel = (data) => {
    const parentModel = new ModelConstructor();
    ModelConstructor.prototype.getMeasurementTypes = model().getMeasurementTypes;

    // the prototype has a new function that was assigned.

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

    // ! Q2 (Concatenative Inheritance) - process of combining the properties of one or more source objects into a new destination object
    // Mixing the properties of two or more objects, simulation
    // Object assign's task is to copy the objects from the min and max to assign it to the target object, to the empty {}

    const getLastDayTemperatureRange = () => {
        const min = getMinTemperatureForLastDay();
        const max = getMaxTemperatureForLastDay();

        return Object.assign({}, min, max);

        //return {
        //    ...min,
        //    ...max
       // }

       // Spread operator means that we take all the values from min and max to make up the new object
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

    // ! Q1 (Factory function)
    // A function that takes all the data, creates an object and returns a new object.
    // It is similar to the function of the constructor, but instead of using new it just returns.
    // If we have 2 objects created using a factory function, those are not created as the same objects, the constructor creates the prototype of the objects.
    // Constructor creates an object with a prototype, the factory function makes a copy for each of the created objects.

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


