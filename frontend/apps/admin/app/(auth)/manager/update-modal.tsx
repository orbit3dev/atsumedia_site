'use client';

import React from 'react';
import {
	modal,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
	SelectItem,
	Select,
} from '@atsumedia/shared-ui';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@sevenvip666/react-art';
import { USER_ROLE_ADMIN, USER_ROLE_MEDIA } from '@atsumedia/amplify-backend';
import { ButtonLoading } from '@atsumedia/shared-ui';
import { SelectValue, SelectTrigger, SelectContent } from '@atsumedia/shared-ui';
import { UserModal } from '@admin/(auth)/manager/columns';

const profileFormSchema = z.object({
	role: z.string({
		required_error: 'ユーザー権限を選択してください',
	}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const UpdateModal = modal<UserModal>(({ onClose, data }) => {
	const { mutate, isLoading } = useMutation<{ username: string; role: string }>('/update-user-attributes', {
		defaultBody: { username: data.username },
		successMessage: 'ユーザーを更新しました。',
	});

	// This can come from your database or API.
	const defaultValues: Partial<ProfileFormValues> = {
		role: '',
	};

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
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a verified email to display" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value={USER_ROLE_ADMIN}>{USER_ROLE_ADMIN}</SelectItem>
									<SelectItem value={USER_ROLE_MEDIA}>{USER_ROLE_MEDIA}</SelectItem>
								</SelectContent>
							</Select>
							<FormDescription>You can manage verified email addresses in your </FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ButtonLoading className="float-right" type="submit" isLoading={isLoading}>
					更新
				</ButtonLoading>
			</form>
		</Form>
	);
});

export { UpdateModal };
