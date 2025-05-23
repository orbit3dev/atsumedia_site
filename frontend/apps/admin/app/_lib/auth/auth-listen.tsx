'use client';
import React, { PropsWithChildren, startTransition, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import { useRouter } from 'next/navigation';
import { EventBus, useEventbus } from '@atsumedia/shared-util';
import { useConfirm } from '@atsumedia/shared-ui';
import { useSignOut } from '@admin/_lib/auth/use-signout';
import { useCookies } from 'react-cookie';

export const logoutPrompt = 'logoutPrompt';

const AuthListen: React.FC<PropsWithChildren> = ({ children }) => {
	const confirm = useConfirm();
	const { signOut } = useSignOut();
	const [_, __, removeTokenInfo] = useCookies(['TokenInfo']);
	const router = useRouter();

	useEffect(() => {
		const hubListenerCancelToken = Hub.listen('auth', (data) => {
			console.log('Listening for all auth events: ', data.payload.event);
			switch (data.payload.event) {
				case 'tokenRefresh_failure':
					EventBus.emit(logoutPrompt);
					break;
				case 'signedIn':
					// startTransition(() => router.push('/'));
					// startTransition(() => router.refresh());
					break;
				case 'signedOut':
					removeTokenInfo('TokenInfo');
					startTransition(() => router.push('/sign-in'));
					startTransition(() => router.refresh());
					break;
			}
		});
		return () => hubListenerCancelToken();
	}, []);

	useEventbus(logoutPrompt, async () => {
		const success = await confirm.open({
			title: 'ログアウトプロンプト',
			description: `ユーザートークンの有効期限が切れています`,
			buttonType: 'submit',
		});
		if (success) {
			await signOut();
		}
	});

	return <>{children}</>;
};

export { AuthListen };
