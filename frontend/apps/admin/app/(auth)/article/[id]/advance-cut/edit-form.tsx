'use client';

import * as z from 'zod';
import {
	ButtonLoading,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@atsumedia/shared-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import React from 'react';
import { useRouter } from 'next/navigation';
import '@aws-amplify/ui-react/styles.css';
import dynamic from 'next/dynamic';
import revalidate from '@admin/(auth)/article/[id]/advance-cut/actions';
import type { Schema } from '@atsumedia/amplify-backend';

const Editor = dynamic(() => import('@atsumedia/shared-editor').then((module) => module.SharedEditor), { ssr: false });

const freeTextFormSchema = z.object({
	content: z.string().min(1, 'content is required'),
});

export type FreeTextFormValues = z.infer<typeof freeTextFormSchema>;

type EditPageProps = {
	data: FreeTextFormValues & { id?: string };
	articleId: string;
    articleFreeTextId?: string;
};

type FreeTextType = Schema['FreeText']['type'];

const EditForm: React.FC<EditPageProps> = ({ data, articleId, articleFreeTextId }) => {
	const router = useRouter();
	const form = useForm<FreeTextFormValues>({
		resolver: zodResolver(freeTextFormSchema),
		defaultValues: {
			...data,
		},
	});

	const isUpdate: boolean = data?.id ? true : false;
	const freeTextId: string = data?.id ?? '';

	const { mutate: saveFreeText, isLoading: saveLoading } = useMutation<FreeTextType>(
		async (body) => {
			const saveFreeTextRes = isUpdate
				? await userPoolClient.models.FreeText.update({
						...body,
						// @ts-ignore
						id: freeTextId,
						type: 'advance_cut',
					})
				: await userPoolClient.models.FreeText.create({
						...body,
						// @ts-ignore
						type: 'advance_cut',
					});
			if (saveFreeTextRes.data && !isUpdate) {
				const articleFreeTextParams = {
					articleId: articleId,
					freeTextId: saveFreeTextRes.data.id,
				};
				// @ts-ignore
				await userPoolClient.models.ArticleFreeText.create(articleFreeTextParams);
			}

			return saveFreeTextRes;
		},
		{
			successMessage: isUpdate ? '先行カットを更新しました。' : '先行カットを追加しました。',
		}
	);

	const { mutate: deleteFreeText, isLoading: deleteLoading } = useMutation<FreeTextType>(
		async () => {
            let res = await userPoolClient.models.ArticleFreeText.delete({
                // @ts-ignore
                id: articleFreeTextId,
            });
            if (res.data) {
			    await userPoolClient.models.FreeText.delete({
				    // @ts-ignore
				    id: freeTextId,
			    });
            }
			return res;
		},
		{
			successMessage: '先行カットを削除しました。',
		}
	);

	const onSubmit = async (data: FreeTextFormValues) => {
		// @ts-ignore
		const params = data as Partial<FreeTextType>;
		const { success } = await saveFreeText(params);
		if (success) {
			await revalidate();
			router.push(`/article`);
		}
	};

	const handleDelete = async () => {
		if (confirm('本当に削除しますか？')) {
            const { success } = await deleteFreeText();
            if (success) {
                await revalidate();
                router.push(`/article`);
            }
		}
	};

	return (
		<>
            {isUpdate && (
                <div className="flex justify-end">
                    <ButtonLoading
                        className="mb-4 bg-red-500"
                        type="button"
                        isLoading={deleteLoading}
                        onClick={handleDelete}>
                        削除
                    </ButtonLoading>
                </div>
            )}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className={'min-h-[280px] pb-8'}>
								<FormLabel>内容</FormLabel>
								<FormControl>
									<div className={'rounded-md border p-2'}>
										<Editor defaultValue={data.content} onChange={field.onChange} />
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<ButtonLoading type="submit" isLoading={saveLoading}>
						保存
					</ButtonLoading>
				</form>
			</Form>
		</>
	);
};

export default EditForm;
