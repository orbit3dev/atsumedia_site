'use client';
import React from 'react';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { GenreTabs } from '@admin/(auth)/pageSetting/tabs';

const Page = () => {
	return (
		<LayoutContent breadcrumb={[{ name: 'ページ表示設定' }]}>
			<GenreTabs />
		</LayoutContent>
	);
};

export default Page;
