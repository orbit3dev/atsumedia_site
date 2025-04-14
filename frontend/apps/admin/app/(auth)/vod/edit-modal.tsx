'use client';

import React from 'react';
import { Input, modal, FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from '@atsumedia/shared-ui';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import { ButtonLoading } from '@atsumedia/shared-ui';
import { VodType } from '@admin/(auth)/vod/page';
import { TableName } from '@atsumedia/data';

const profileFormSchema = z.object({
	id: z.string({
		required_error: 'id mast required',
	}),
	name: z.string({
		required_error: 'name mast required',
	}),
	microcopy: z.string(),
	url: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const EditModal = modal<VodType>(({ onClose, data }) => {
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: data as Partial<ProfileFormValues>,
	});

	const isUpdate = !!data;

	const { mutate: addTodo, isLoading: addLoading } = useMutation<VodType>(
		({ id, name, microcopy, url }) =>
			userPoolClient.models.Vod.create({ id, name, microcopy, url, sort: parseInt(id), type: TableName.Vod }),
		{
			successMessage: 'Vodを追加しました。',
		}
	);

	const { mutate: updateTodo, isLoading: updateLoading } = useMutation<VodType>(
		({ name, microcopy, url }) => userPoolClient.models.Vod.update({ id: data.id, name, microcopy, url }),
		{
			successMessage: 'Vodを更新しました。',
		}
	);

	const onSubmit = async (data: ProfileFormValues) => {
		console.log(data);
		const { success } = await (isUpdate ? updateTodo(data) : addTodo(data));
		if (success) {
			onClose(success);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ID</FormLabel>
							<FormControl>
								<Input placeholder="id" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="microcopy"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="microcopy" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ButtonLoading className="float-right" type="submit" isLoading={addLoading || updateLoading}>
					Add
				</ButtonLoading>
			</form>
		</Form>
	);
});

export default EditModal;
