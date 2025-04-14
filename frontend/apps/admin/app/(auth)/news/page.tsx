'use client';
import React from 'react';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import { GenreTabs } from '@admin/(auth)/news/tabs';

const Page = () => {
	return (
		<LayoutContent breadcrumb={[{ name: 'ニュース' }]}>
			<GenreTabs />
		</LayoutContent>
	);
};

export default Page;
