'use client';

import React from 'react';
import {
	Input,
	modal,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
} from '@atsumedia/shared-ui';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@sevenvip666/react-art';
import { USER_POOL_GROUP_ADMINS } from '@atsumedia/amplify-backend';
import { ButtonLoading } from '@atsumedia/shared-ui';

const profileFormSchema = z.object({
	username: z
		.string({
			required_error: '有効なメールアドレスを入力してください',
		})
		.email(),
	password: z.string().regex(RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$'), {
		message:
			'パスワードの最小長\n' +
			'8文字\n' +
			'パスワードの要件\n' +
			'少なくとも 1 つの数字が含まれています\n' +
			'少なくとも 1 つの特殊文字が含まれています\n' +
			'少なくとも 1 つの大文字が含まれている\n' +
			'少なくとも 1 つの小文字が含まれています',
	}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
	password: 'Aa123456!',
};

const AddModal = modal(({ onClose }) => {
	const { mutate, isLoading } = useMutation<{ username: string; password: string; group: string }>('/create-user', {
		defaultBody: { group: USER_POOL_GROUP_ADMINS },
		successMessage: 'ユーザーを追加しました。',
	});

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
	});

	const onSubmit = async (data: ProfileFormValues) => {
		const { success } = await mutate(data);
		if (success) {
			onClose(success);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>メールアドレス</FormLabel>
							<FormControl>
								<Input placeholder="メールアドレスを入力してください" {...field} />
							</FormControl>
							<FormDescription>
								ユーザーアカウントとしてメールアドレスを入力する必要があります
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>パスワード</FormLabel>
							<FormControl>
								<Input placeholder="パスワードを入力してください" {...field} />
							</FormControl>
							<FormDescription>
								ユーザーの一時パスワード。
								仮パスワードは一度だけ有効です。管理者のユーザー作成フローを完了するには、ユーザーはサインイン
								ページに一時パスワードと、今後のすべてのサインインで使用する新しいパスワードを入力する必要があります。
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ButtonLoading className="float-right" type="submit" isLoading={isLoading}>
					追加
				</ButtonLoading>
			</form>
		</Form>
	);
});

export { AddModal };
