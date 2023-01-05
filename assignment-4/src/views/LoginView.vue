<template>
  <div>
    <h1>Login</h1>

    <div class="w-35 mx-auto card p-4 text-left mt-4">
      <form @submit.prevent="signIn">
        <div class="form-group mt-4">
          <div>Username</div>
          <input v-model="username" type="text" class="form-control mt-1">
          <small class="text-danger" v-if="username.length && usernameInvalid">Username should be between 3 - 12 letters</small>
        </div>
        <div class="form-group mt-4">
          <div>Password</div>
          <input v-model="password" type="password" class="form-control mt-1">
          <small class="text-danger" v-if="password.length && passwordInvalid">Password should be between 3 - 12 letters</small>
        </div>
        <button :disabled="usernameInvalid || passwordInvalid" type="submit" class="w-100 btn btn-primary mt-4 mb-3">Login</button>
      
        <div v-if="error" class="alert alert-danger">
          Error occurred. Try again later.
        </div>

        <div v-if="authenticationError" class="alert alert-danger">
          Invalid login or password
        </div>

        <div v-if="success" class="alert alert-success" >
          Login successful!
        </div>
      </form>
    </div>
  </div>
</template>

<script >
import {login} from '../services/auth.service';
import { store } from '../utils/store'

  export default {

    // ! Q8 (2-way data binding)
    // 2-way data binding means that the script part (the viewmodel part), might update the view and its variables, 
    // where the view can update the variables in the viewmodel.

    // ! Q8 (2-way-data-binding) - As seen above there are 2 inputs using v-model, which is a directive shared by VUE, that allows to use 2 way data binding.
    // If the user inserts the information to the username input, thanks to this directive the variable will get overriten in the viewmodel.
    // By that the viewmodel has the data inserted by the user appropriately.
    // Besides the v-model directive, there is v-if, allowing to react to the view after the changes in viewmodel.
    // The directive disabled is meant to block from the further action if the username or password are incorrect.

    // *Directive - a reusable chunk of code to be used in multiple places.

    // ! Q9 (vue local state)
    // Each component due to the structure, has its own reactive state which countinously updates the components.
    // Context component is used in case of the following component.

    data() {
      return {
        username: '',
        password: '',
        error: undefined,
        success: undefined,
        
        usernameInvalid: true,
        passwordInvalid: true,
        authenticationError: false,
        store,
      }
    },

    // watch is a property shared by VUE that allows to listen to the changes in the variables.
    // thanks to that we have a mechanism for the length of the symboles in the username.
    // once the user presses the button submit/login, the function signin is called to edit 3 variables to be set to false,
    // call the login function from the outer service
    // waiting for an answer from that function after.
    // If the response is right, change the variables to true.

    watch: {
      username() {
        if(this.username.length < 3 || this.username.length > 12) {
            this.usernameInvalid = true;
            return;
          }
          this.usernameInvalid = false;
      },
      password() {
        if(this.password.length < 3 || this.password.length > 12) {
            this.passwordInvalid = true;
            return;
          }
          this.passwordInvalid = false;
      }
    },

     // Router is a variable set by VUE that allows to do the routing between the views, to redirect the user to the game.
     // The user gets redirected to the main view.
     // If the logging will not go right, there is an answer in return with the code 403 - uncorrect data, while the case is any other unexpected error.
  
    methods: {
      signIn() {
        this.error = false;
        this.authenticationError = false;
        this.success = false;
    
        // Then is an asynchronous request to the API, which result is located there if it is right, otherwise a catch is used.

        login(this.username, this.password).then(() => {
          this.success = true;
          this.store.isLoggedIn = true;
          this.$router.replace({path: "/game"})

        }).catch((err) => {
          if (err.message.includes('403')) {
            this.authenticationError = true;
            return;
          }

          this.error = true;
        })
      },
    }
  }

</script>

<style>
  .text-left {
    text-align: left;
  }
  .w-35 {
    width: 35%;
  }
</style>
