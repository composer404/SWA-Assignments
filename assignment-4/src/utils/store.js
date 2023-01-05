import { reactive } from 'vue'

// ! Q9 (vue global state)
// There is a situation where the global state needs to used
// An example of reactive state shared by VUE
// The components can use it to overrite the information to change the state.

export const store = reactive({
  isLoggedIn: false,
})