import { z } from 'zod';

export enum ActionPrefix {
  Space = 'space',
  Document = 'document',
}

const defaultActionsSchema = z.enum(['create', 'update', 'delete', 'read']);

export const spaceActionsSchema = defaultActionsSchema.or(
  z.enum(['invite_email', 'invite_link', 'grant_role']),
);

export type SpaceActions = `${ActionPrefix.Space}|${z.infer<typeof spaceActionsSchema>}`;

export const documentActionsSchema = defaultActionsSchema;

export type DocumentActions = `${ActionPrefix.Document}|${z.infer<typeof documentActionsSchema>}`;

export type AllActions = SpaceActions | DocumentActions;
