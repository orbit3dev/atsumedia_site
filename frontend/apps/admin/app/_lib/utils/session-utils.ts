import { JWT } from '@aws-amplify/core';

export const getSessionInfoByToken = (jwt: JWT) => {
  const payload = jwt.payload;
  return {
    username: payload['cognito:username'] as string,
    groups: payload['cognito:groups'] as string[],
    email: payload['email'] as string,
  };
};
