
/* ------------------------------ CALL FUNCTION ----------------------------- */

const person = {
    fullName: function() {
      return this.firstName + " " + this.lastName;
    }
}

const person1 = {
    firstName:"John",
    lastName: "Doe"
}

const person2 = {
    firstName:"Mary",
    lastName: "Doe"
}
  
// We pass person1 as a "this" to the method 
// Allows to change this from the firstname/lastname to John Doe which a the property of person1
// Call and Apply are identical, call sends an object as a board, where the apply is done after the point.
person.fullName.call(person1);

/* ----------------------------- APPLY FUNCTION ----------------------------- */

const person3 = {
    fullName: function(age) {
      return this.firstName + " " + this.lastName + age;
    }
  }
  
  const person4 = {
    firstName: "Mary",
    lastName: "Doe"
  }
  
  // The same as call, but arguments can be passed as array
  person.fullName.apply(person2, [43]);

/* ------------------------------ BIND FUNCTION ----------------------------- */

//? Borrow properties example
const person5 = {
    firstName:"John",
    lastName: "Doe",
    fullName: function () {
      return this.firstName + " " + this.lastName;
    }
}
  
const member = {
    firstName:"Tom",
    lastName: "Holland",
}

const methodWithNewContext = person5.findName.bind(number);
person5.fullName.bind(member); 

//? Prevent loosing this in callback functions
//bind has an built in reference that allows to modify the connections to an object.
//bind compared to call and apply returns a copy/new method with a new context.

const person6 = {
    firstName:"John",
    lastName: "Doe",
    display: function () {
      let x = document.getElementById("demo");
      x.innerHTML = this.firstName + " " + this.lastName;
    }
  }
  
  let display = person6.display.bind(person6);
  setTimeout(display, 3000);