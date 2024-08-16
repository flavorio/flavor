import { SpaceRole } from '@flavor/core';

export type Space = {
  id: string;
  name: string;
  role: SpaceRole;
  documents: Documents;
};

export type SpaceList = Space[];

export type SpaceInfo = Space;

export type Document = {
  id: string;
  spaceId: string;
  name: string;
};

export type Documents = Document[];

export type InviteLink = {
  createdBy: string;
  createdAt: string;
  invitationCode: string;
  invitationId: string;
  inviteUrl: string;
  role: SpaceRole;
};

export type SpaceMember = {
  avatar: string;
  createdAt: string;
  email: string;
  role: SpaceRole;
  userId: string;
  userName: string;
};

export type UserInfo = {
  id: string;
  name: string;
  email: string;
};
