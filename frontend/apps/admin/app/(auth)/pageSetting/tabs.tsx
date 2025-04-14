import { Tabs, TabsContent, TabsList, TabsTrigger } from '@atsumedia/shared-ui';
import { PageSettingTable } from '@admin/(auth)/pageSetting/page-setting-table';
import React from 'react';
import { categoryList } from '@atsumedia/data';

export function GenreTabs() {
	return (
		<Tabs defaultValue="anime">
			<TabsList>
				{categoryList?.map((item) => {
					return (
						<TabsTrigger key={item.key} value={item.key}>
							{item.value.name}
						</TabsTrigger>
					);
				})}
			</TabsList>
			{categoryList?.map((item) => {
				return (
					<TabsContent key={item.key} value={item.key}>
						<PageSettingTable genreType={item.key} />
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
