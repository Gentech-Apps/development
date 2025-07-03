import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import CryptoJS from "crypto-js";
// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const key = "**************************"; // change to your key
const iv = "********"; // change to your iv
const apiKey = "***************"; // change to your api key

const aesEncrypt = (txt) => {
  const cipher = CryptoJS.AES.encrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return cipher.toString();
};
const aesDencrypt = (txt) => {
  const cipher = CryptoJS.AES.decrypt(txt, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
  });

  return CryptoJS.enc.Utf8.stringify(cipher).toString();
};

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
    logout: false,
    mentorName: "",
    reportTabName: "",
  },
  plugins: [createPersistedState()],
  mutations: {
    setToken(state, token) {
      if (token) {
        state.token = aesEncrypt(token);
      } else {
        state.token = token;
      }
    },
    setLogout(state, value) {
      state.logout = value;
    },
    setMentor(state, value) {
      state.mentorName = value;
    },
    setUser(state, user) {
      if (user) {
        const u = JSON.stringify(user);
        state.user = aesEncrypt(u);
      } else {
        state.user = user;
      }
    },
    setUserId(state, userId) {
      state.user._id = userId;
    },
    setDepartments(state, departments) {
      state.user.departments = departments;
    },
    setProjects(state, projects) {
      state.allProjects = projects;
    },
    changeTabName(state, value) {
      state.reportTabName = value;
    },
    setSettlementTitle(state, value) {
      state.userSettlementTitle = value;
    },
    setSettlementId(state, value) {
      state.userSettlementId = value;
    },
    setSettlementData(state, value) {
      state.userSettlementData = value;
    },
  },
  getters: {
    logout(state) {
      return state.logout;
    },
    user(state) {
      if (!state.user) return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u);
    },
    mentees(state) {
      if (!state.user) return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u).mentees;
    },
    reportTabName(state) {
      if (state.reportTabName) {
        return state.reportTabName;
      }
    },
    mentorName(state) {
      if (state.mentorName) {
        return state.mentorName;
      }
    },
    userId(state) {
      if (state.user) {
        const u = aesDencrypt(state.user);
        return JSON.parse(u)._id;
      }
    },
    mentor(state) {
      if (state.user) {
        const u = aesDencrypt(state.user);
        return JSON.parse(u).mentor;
      }
    },
    token(state) {
      return state.token ? aesDencrypt(state.token) : null;
    },
    isAuthenticated(state) {
      return state.token ? true : false;
    },
    userName(state) {
      if (!state.user) return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u).userFirstName + " " + JSON.parse(u).userLastName;
    },
    userType(state) {
      if (!state.user) return "ERROR";
      const u = aesDencrypt(state.user);
      return JSON.parse(u).userType;
    },
    allProjects(state) {
      return state.allProjects;
    },
    userSettlementTitle(state) {
      return state.userSettlementTitle;
    },
    userSettlementData(state) {
      return state.userSettlementData;
    },
    userSettlementId(state) {
      return state.userSettlementId;
    },
  },
  actions: {},
  modules: {},
});
