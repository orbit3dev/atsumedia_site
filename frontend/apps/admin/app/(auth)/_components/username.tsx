'use client';
import React from 'react';
import { LogOut } from 'lucide-react';
import { useConfirm } from '@atsumedia/shared-ui';
import { userAuthStore } from '@admin/_lib/auth/auth-user';
import { useSignOut } from '@admin/_lib/auth/use-signout';

const Username = () => {
	const sessionInfo = userAuthStore((state) => state.sessionInfo);
	const confirm = useConfirm();
	const { signOut } = useSignOut();

	return (
		<div className="flex w-auto items-center space-x-2">
			<div className="space-x-2">{sessionInfo?.email}</div>
			{/*<PresetActions />*/}
			<LogOut
				className={'cursor-pointer text-red-500'}
				onClick={async () => {
					const success = await confirm.open({
						title: 'サインアウト',
						description: 'ログアウトしてもよろしいですか?',
            cancelText: 'キャンセル',
            confirmText: '確認',
					});
					if (success) {
						signOut().then();
					}
				}}
			/>
		</div>
	);
};

export default Username;
