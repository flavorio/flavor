import { Inject } from "@nestjs/common";
import { ConfigType, registerAs } from "@nestjs/config";


export const mailConfig = registerAs('mail', () => ({
  origin: process.env.PUBLIC_ORIGIN ?? 'https://flavor.io',
}));

export const MailConfig = () => Inject(mailConfig.KEY);

export type IMailConfig = ConfigType<typeof mailConfig>;
