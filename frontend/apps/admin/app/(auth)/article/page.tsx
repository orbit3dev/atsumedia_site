'use client';
import React from 'react';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { GenreTabs } from '@admin/(auth)/article/tabs';

const Page = () => {
	return (
		<LayoutContent breadcrumb={[{ name: '開発チーム共有用_アニメ項目マスタ' }]}>
			<GenreTabs />
		</LayoutContent>
	);
};

export default Page;
