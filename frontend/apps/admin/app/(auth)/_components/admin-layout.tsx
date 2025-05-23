import React, { PropsWithChildren } from 'react';
import { Separator } from '@atsumedia/shared-ui';
import { LayoutMenu } from '@admin/(auth)/_components/layout-menu';
import { cookies } from 'next/headers';
import Username from '@admin/(auth)/_components/username';

type AdminLayoutProps = {
	authGroups: string[];
};

const AdminLayout: React.FC<PropsWithChildren<AdminLayoutProps>> = ({ children, authGroups }) => {
	const layout = cookies().get('react-resizable-panels:layout');
	const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
	return (
		<div className="flex h-screen w-full flex-col">
			<div className="flex w-full flex-row items-center justify-between space-y-2 px-4 py-4 sm:items-center sm:space-y-0 md:h-16">
				<h2 className="w-auto text-lg font-semibold">Atsumedia Admin</h2>
				<Username />
			</div>
			<Separator />

			<LayoutMenu defaultLayout={defaultLayout} navCollapsedSize={4} defaultCollapsed={false}>
				{children}
			</LayoutMenu>
		</div>
	);
};

export default AdminLayout;
