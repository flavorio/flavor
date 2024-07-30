import { pick } from 'lodash';
export const pickUserMe = (user: any) => {
  return {
    ...pick(user, 'id', 'name', 'phone', 'email'),
    hasPassword: user.password !== null,
  };
};
