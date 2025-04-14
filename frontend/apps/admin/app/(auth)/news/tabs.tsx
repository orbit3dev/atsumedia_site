import { Tabs, TabsContent, TabsList, TabsTrigger } from '@atsumedia/shared-ui';
import React from 'react';
import { categoryList } from '@atsumedia/data';
import { NewsTable } from '@admin/(auth)/news/news-table';

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
						<NewsTable genreType={item.key} />
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
