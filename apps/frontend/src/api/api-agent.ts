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

  user: {
    async getUserInfo() {
      return await instance.post("user/getUserInfo/");
    },
  },

  document: {
    async createDocument(payload: CreateDocumentPayload) {
      return await instance.post("/document/createDocument", payload);
    },
  },

  space: {
    async getSpaceList() {
      return await instance.post("/space/getSpaceList");
    },

    async getSpaceInfo(payload: PayloadWithId) {
      return await instance.post("/space/getSpaceInfo", payload);
    },
  },
};
