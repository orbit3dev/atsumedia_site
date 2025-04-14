'use client';

import * as React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@atsumedia/shared-ui';
import { Button } from '@atsumedia/shared-ui';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export function PresetActions() {
	const router = useRouter();

	const logout = async () => {
		await signOut();
		router.replace('/sign-in');
	};
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary">设置</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onSelect={() => {}}>个人信息</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => logout()} className="text-red-600">
						退出
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
