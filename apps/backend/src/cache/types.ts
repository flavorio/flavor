import type { ISessionData } from '../types/session';

export interface ICacheStore {
  // [key: `attachment:signature:${string}`]: IAttachmentSignatureCache;
  // [key: `attachment:upload:${string}`]: IAttachmentUploadCache;
  // [key: `attachment:local-signature:${string}`]: IAttachmentLocalTokenCache;
  // [key: `attachment:preview:${string}`]: IAttachmentPreviewCache;
  [key: `auth:session-store:${string}`]: ISessionData;
  [key: `auth:session-user:${string}`]: Record<string, number>;
  [key: `auth:session-expire:${string}`]: boolean;
  // [key: `oauth2:${string}`]: IOauth2State;
  // [key: `reset-password-email:${string}`]: IResetPasswordEmailCache;
}
