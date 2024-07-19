import axios from "axios";
import { CreateDocumentRo, SigninRo, SignupRo } from "@flavor/core/data";

const baseURL = "/api/";

const instance = axios.create({
  baseURL,
  timeout: 30000,
});

export const apiAgent = {
  auth: {
    async signup(payload: SignupRo) {
      return await instance.post("auth/signup/", payload);
    },

    async signin(payload: SigninRo) {
      return await instance.post("auth/signin/", payload);
    },
  },

  user: {
    async getUserInfo() {
      return await instance.post("user/getUserInfo/");
    },
  },

  document: {
    async createDocument(payload: CreateDocumentRo) {
      return await instance.post("/document/createDocument", payload);
    },

    async getDocument(payload: PayloadWithId) {
      return await instance.post("/document/getDocument", payload);
    },

    async updateDocument(payload: PayloadWithId & { [key: string]: any }) {
      return await instance.post("/document/updateDocument", payload);
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
