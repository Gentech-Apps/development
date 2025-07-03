import axios from "axios";
import store from "../store/index";
const token = store.getters.token;
export default () => {
  return axios.create({
    baseURL: process.env.API_URL,
    headers: {
      common: {
        Authorization: `Bearer ${token}`,
        TimeStamp: new Date(),
      },
    },
  });
};
