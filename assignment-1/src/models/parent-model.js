import { DateTime } from "luxon";

// ! Q1 (Constructor function)
function ModelConstructor() {
    this.getListByMeasurementType = (values, type) => {
        return values.filter((element) => {
            return element.type === type;
        }).sort((element, nextElement) => {
            return new Date(element.time) - new Date(nextElement.time);
        }).reverse();
    };

    this.getMeasurementTypeForLastDay = (values, type) => {
        return values.filter((element) => {
            const yesterdayDate = DateTime.now().minus({days: 1}).toFormat(`yyyy/MM/dd`);
            const elementDate = DateTime.fromISO(element.time).toFormat(`yyyy/MM/dd`);
            return element.type === type && yesterdayDate === elementDate;
        });
    }
}


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
            const yesterdayDate = DateTime.now().minus({days: 1}).toFormat(`yyyy/MM/dd`);
            const elementDate = DateTime.fromISO(element.time).toFormat(`yyyy/MM/dd`);
            return element.type === type && yesterdayDate === elementDate;
        });
    }

    return { getListByMeasurementType, getMeasurementTypes, getMeasurementTypeForLastDay }
}

export { model, ModelConstructor };