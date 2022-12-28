function createEmployee(firstName, lastName) {
    return {
       firstName,
       lastName,
       getName: () => {
          console.log(`Employee: ${firstName} ${lastName}`);
       }
    };
 }

const person1 = createEmployee(`Bob`, `Bob`);
const person2 = createEmployee(`Tom`, `Tom`);