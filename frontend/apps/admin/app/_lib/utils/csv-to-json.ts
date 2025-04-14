import Papa from 'papaparse';

export type objectMappers = { name: string; index: number; check?: (item: string) => boolean }[];

export const fileParser = (file: File, objectMappers: objectMappers, skipRows: number = 2, skipColumns: number = 1) => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		Papa.parse(file, {
			header: false,
			delimiter: '', // auto-detect
			newline: '', // auto-detect
			quoteChar: '"',
			escapeChar: '"',
			skipEmptyLines: false,
			complete: (results) => {
				if (!results.data) {
					resolve([]);
					return;
				}
				const result = [];
				const csvArray = results?.data as string[][];
				const skipRowsArr = csvArray.slice(skipRows, csvArray.length);
				csv: for (const skipRowsArrElement of skipRowsArr) {
					const finishArr = skipRowsArrElement.slice(skipColumns, skipRowsArrElement.length);
					if (finishArr.length == 0) {
						continue;
					}
					const obj = {};
					for (let i = 0; i < objectMappers.length; i++) {
						const mapper = objectMappers[i];
						const value = finishArr[mapper.index];
						if (mapper.check && !mapper.check(value)) {
							console.log(mapper, value, finishArr);
							continue csv;
						}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						obj[mapper.name] = value;
					}
					result.push(obj);
				}
				resolve(result);
			},
			error: () => {
				reject(new Error('csv parse err'));
			},
		});
	});
};
