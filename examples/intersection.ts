// ! Q3 (intersection)
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
type DriverResponse = DriverData & ErrorHandling;
type CarResponse = CarData & ErrorHandling;

const handleArtistsResponse = (response: DriverResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.driver);
};
