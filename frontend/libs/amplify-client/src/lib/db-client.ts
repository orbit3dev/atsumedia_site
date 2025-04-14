import { generateClient } from 'aws-amplify/data';
import { type Schema } from '@atsumedia/amplify-backend';

export const userPoolClient = generateClient<Schema>({
	authMode: 'userPool',
});

// API KEY使用しない
//export const apiKeyPoolPoolClient = generateClient<Schema>({
	//authMode: 'apiKey',
//});

export const iamClient = generateClient<Schema>({
	authMode: 'iam',
});
