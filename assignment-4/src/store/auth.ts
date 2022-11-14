import AuthService from '../services/auth.service';

const user = localStorage.getItem('user');
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit}: { commit: Function }, username:string, password:string) {
      return AuthService.login(username,password).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }: { commit: Function }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }: { commit: Function },  username:string, password:string) {
      return AuthService.register(username,password).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state:any, user:any) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state:any) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state:any) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state:any) {
      state.status.loggedIn = false;
    },
    registerFailure(state:any) {
      state.status.loggedIn = false;
    }
  }
};