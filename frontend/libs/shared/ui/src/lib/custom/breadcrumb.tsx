'use client';

import Link from 'next/link';
import React from 'react';

export type BreadcrumbMenuProps = {
	href?: string;
	name: string;
};

interface BreadcrumbProps {
	menus: BreadcrumbMenuProps[];
}

export function Breadcrumb({ menus }: BreadcrumbProps) {
	return (
		<div className="mb-2 h-16 text-sm leading-8">
			{menus.map((item, index) =>
				index !== menus.length - 1 ? (
					<span key={item.name} className="text-gray-400">
						{item.href && <Link href={item.href}>{item.name}</Link>}
						{!item.href && item.name} /{' '}
					</span>
				) : (
					<span key={item.name}>{item.name}</span>
				)
			)}
		</div>
	);
}
