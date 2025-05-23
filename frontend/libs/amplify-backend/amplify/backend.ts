import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { AdminQueriesApi } from './custom/admin-query/resource';
import { UserPollGroup } from './custom/user-pool-group/resource';
import { USER_POOL_GROUP_ADMINS } from './constant';
import { AuthTrigger } from './custom/auth-trigger/resource';
import { Stack } from 'aws-cdk-lib';
import { PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { handlePublicStorage, storage } from './storage/resource';

const backend = defineBackend({
	auth,
	data,
	storage,
});

const ddbTable = backend.data.resources.tables['Todo'];
backend.addOutput({
	custom: {
		Table: Object.entries(backend.data.resources.tables)
			.map(([key, value]) => ({ [key]: value.tableName }))
			.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
	},
});
const ddbDataSourceRoleArn = backend.data.resources.cfnResources.cfnDataSources['TodoTable'].serviceRoleArn;
if (ddbDataSourceRoleArn) {
	const ddbDataSourceRole = Role.fromRoleArn(Stack.of(backend.data), 'DynamoDBServiceRoleArn', ddbDataSourceRoleArn);
	ddbDataSourceRole.addToPrincipalPolicy(
		new PolicyStatement({
			actions: ['dynamodb:BatchWriteItem'],
			resources: [ddbTable.tableArn],
		})
	);
}

const s3Bucket = backend.storage.resources.bucket;

handlePublicStorage(s3Bucket);

const userPool = backend.auth.resources.userPool as UserPool;

// create auth trigger stack
const authTriggerName = 'AuthTriggerStack';
const authTriggerStack = backend.createStack(authTriggerName);
new AuthTrigger(authTriggerStack, authTriggerName, { userPool: userPool });

// create groups stack
const authGroupsName = 'AuthGroupsStack';
const groupsStack = backend.createStack(authGroupsName);
new UserPollGroup(groupsStack, authGroupsName, {
	userPool: userPool,
	identityPoolId: backend.auth.resources.cfnResources.cfnIdentityPool.ref,
});

// create the bucket and its stack
// const publicBucketName = 'PublicBucketStack';
// const bucketStack = backend.createStack(publicBucketName);
// new PublicBucket(bucketStack, publicBucketName, {
// 	resources: backend.auth.resources,
// });

// create the admin queries
const adminQueriesName = 'AdminQueries';
const adminQueriesStack = backend.createStack(adminQueriesName);
const adminApi = new AdminQueriesApi(adminQueriesStack, adminQueriesName, {
	userPool,
	userPoolClients: [backend.auth.resources.userPoolClient],
	allowGroups: [USER_POOL_GROUP_ADMINS],
});

backend.addOutput({
	custom: {
		API: {
			[adminQueriesName]: {
				endpoint: adminApi.url,
			},
		},
		S3: {
			endpoint: s3Bucket.bucketRegionalDomainName,
		},
	},
});
