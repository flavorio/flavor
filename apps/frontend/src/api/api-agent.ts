import axios from "axios";

const baseURL = "/api/";

const instance = axios.create({
  baseURL,
  timeout: 30000,
});

export const apiAgent = {
  auth: {
    async signup(payload: SignupPayload) {
      return await instance.post("auth/signup/", payload);
    },

    async signin(payload: SigninPayload) {
      return await instance.post("auth/signin/", payload);
    },
  },
};
