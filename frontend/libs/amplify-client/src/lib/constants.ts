import { outputs } from '@atsumedia/amplify-backend';

const endpoint = outputs.custom.S3.endpoint;

export const S3Domain = endpoint.includes('https://') ? endpoint : `https://${endpoint}`;
