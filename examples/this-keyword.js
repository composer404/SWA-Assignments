
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

person5.fullName.bind(member); 

//? Prevent loosing this in callback functions
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