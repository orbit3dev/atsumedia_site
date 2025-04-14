import { Tabs, TabsContent, TabsList, TabsTrigger } from '@atsumedia/shared-ui';
import { ArticlesTable } from '@admin/(auth)/article/article-table';
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
						<ArticlesTable genreType={item.key} />
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
