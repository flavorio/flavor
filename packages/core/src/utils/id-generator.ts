import { customAlphabet } from 'nanoid';


export enum IdPrefix {
  Space = 'spc',
  User = 'usr',
  Account = 'aco',
  Document = 'doc',
  Invitation = 'inv',
}

const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(chars);

export function getRandomString(len: number) {
  return nanoid(len);
}


export function generateUserId() {
  return IdPrefix.User + getRandomString(16);
}

export function generateSpaceId() {
  return IdPrefix.Space + getRandomString(16);
}


export function generateAccountId() {
  return IdPrefix.Account + getRandomString(16);
}

export function generateDocumentId() {
  return IdPrefix.Document + getRandomString(16);
}

export function generateInvitationId() {
  return IdPrefix.Invitation + getRandomString(16);
}
