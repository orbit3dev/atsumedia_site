import React from 'react';
import AdminLayout from '@admin/(auth)/_components/admin-layout';
import { LoadingProvider, ConfirmProvider } from '@atsumedia/shared-ui';
import { AuthClient } from '@admin/_lib/auth/auth-client';
import { cookies } from 'next/headers';
import { SessionInfo } from '@admin/_lib/auth/auth-user';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
	const tokenInfoStr = cookies().get('TokenInfo');
	const tokenInfo = tokenInfoStr ? (JSON.parse(tokenInfoStr.value) as SessionInfo) : undefined;
	if (!tokenInfo) {
		return <>{tokenInfoStr}</>;
	}
	return (
		<AuthClient sessionInfo={tokenInfo}>
			<AdminLayout authGroups={tokenInfo.groups}>
				<LoadingProvider />
				<ConfirmProvider />
				<div className="container mx-auto">{children}</div>
			</AdminLayout>
		</AuthClient>
	);
}
