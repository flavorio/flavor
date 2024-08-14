import axios, { AxiosInstance } from 'axios';
import {
  AcceptInvitationLinkRo,
  CreateDocumentRo,
  CreateSpaceInvitationLinkRo,
  DeleteSpaceInvitationLinkRo,
  DeleteSpaceMemberRo,
  SigninRo,
  SignupRo,
  UpdateDocumentRecordsRo,
  UpdateSpaceInvitationLinkRo,
  UpdateSpaceMemberRo,
} from '@flavor/core';

const API_URL = process.env.API_URL;

const instance = axios.create({
  baseURL: '/api/',
  timeout: 30000,
});

const instanceSSR = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

const createApiAgent = (instance: AxiosInstance) => ({
  instance,
  auth: {
    async signup(payload: SignupRo) {
      return await instance.post('auth/signup/', payload);
    },

    async signin(payload: SigninRo) {
      console.log('test: ', instance.defaults);
      return await instance.post('auth/signin/', payload);
    },
  },

  user: {
    async getUserInfo() {
      return await instance.post('user/getUserInfo/');
    },
  },

  document: {
    async createDocument(payload: CreateDocumentRo) {
      return await instance.post('/document/createDocument', payload);
    },

    async getDocument(payload: PayloadWithId) {
      return await instance.post('/document/getDocument', payload);
    },

    async updateDocument(payload: PayloadWithId & { [key: string]: any }) {
      return await instance.post('/document/updateDocument', payload);
    },

    async updateDocumentRecords(payload: UpdateDocumentRecordsRo) {
      return await instance.post('/document/updateDocumentRecords', payload);
    },
  },

  space: {
    async getSpaceList() {
      return await instance.post('/space/getSpaceList');
    },

    async getSpaceInfo(payload: PayloadWithId) {
      return await instance.post('/space/getSpaceInfo', payload);
    },

    async getSpaceInviteLinks(payload: PayloadWithId) {
      return await instance.post('/space/getSpaceInviteLinks', payload);
    },

    async getSpaceMembers(payload: PayloadWithId) {
      return await instance.post('/space/getSpaceMembers', payload);
    },

    async deleteSpaceMember(payload: DeleteSpaceMemberRo) {
      return await instance.post('/space/deleteSpaceMember', payload);
    },

    async updateSpaceMember(payload: UpdateSpaceMemberRo) {
      return await instance.post('/space/updateSpaceMember', payload);
    },
  },

  invitation: {
    async createSpaceInviteLink(payload: CreateSpaceInvitationLinkRo) {
      return await instance.post('/invitation/createInvitationLink', payload);
    },

    async deleteSpaceInviteLink(payload: DeleteSpaceInvitationLinkRo) {
      return await instance.post('/invitation/deleteInvitationLink', payload);
    },

    async updateSpaceInviteLink(payload: UpdateSpaceInvitationLinkRo) {
      return await instance.post('/invitation/updateInvitationLink', payload);
    },

    async acceptInvitationLink(payload: AcceptInvitationLinkRo) {
      return await instance.post('/invitation/acceptInvitationLink', payload);
    },
  },
});

export const apiAgent = createApiAgent(instance);

export const apiAgentSSR = createApiAgent(instanceSSR);
