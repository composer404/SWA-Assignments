
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface CarData {
  car: {
    model: string;
    series: string;
    make: string;
  }[];
}

interface DriverData {
  driver: {
    firstName: string;
    lastName: string;
    licenseNumber: string;
  }[];
}

// ? types intersection
// ! Q3 (intersection)
// Allows to connect the different types
// The properties are connected in case of getting a new type based on the connection of 2 interfaces.

type DriverResponse = DriverData & ErrorHandling;
type CarResponse = CarData & ErrorHandling;

const handleArtistsResponse = (response: DriverResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.driver);
};
