import { outputs } from '@atsumedia/amplify-backend';
import { TableName } from '@atsumedia/data';

export const getTableName = (table: TableName) => {
	return outputs.custom.Table[table];
};
