'use client';
import * as React from 'react';
import { Breadcrumb, BreadcrumbMenuProps } from '@atsumedia/shared-ui';
import { PropsWithChildren } from 'react';

interface LayoutContentProps {
	breadcrumb?: BreadcrumbMenuProps[];
}

export const LayoutContent: React.FC<PropsWithChildren<LayoutContentProps>> = ({ children, breadcrumb }) => {
	return (
		<div className="container mx-auto px-[1px]">
			{breadcrumb && <Breadcrumb menus={breadcrumb} />}
			{children}
		</div>
	);
};
