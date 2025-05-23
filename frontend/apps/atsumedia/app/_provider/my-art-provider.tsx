'use client';
import { ArtConfigOptions, ArtProvider, UseResult } from '@sevenvip666/react-art';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthError, fetchAuthSession } from 'aws-amplify/auth';
import { useLoading } from '@atsumedia/shared-ui';
import { NotAuthorizedException, UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { toast } from 'sonner';
import { outputs } from '@atsumedia/amplify-backend';

export const MyArtProvider = () => {
	const { closeLoading, openLoading } = useLoading();
	const instanceCallback = (instance: AxiosInstance) => {
		instance.interceptors.request.use(
			async (config) => {
				const session = await fetchAuthSession();
				const authToken = session.tokens?.accessToken?.toString();
				if (authToken) {
					config.headers.set('Authorization', `Bearer ${authToken}`);
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
	};

	const config: ArtConfigOptions = {
		baseURL: outputs.custom.API.AdminQueries.endpoint,
		axios: {
			axios: axios,
			instanceCallback,
		},
		convertPage: ({ pageSize, nextToken }) => {
			return { limit: pageSize, nextToken };
		},
		convertRes: (res, request): UseResult => {
			if (request.type == 'customize') {
				if (res.errors) {
					const error = res.errors[0];
					return { success: false, message: error.message, code: error.errorType };
				}
				return { success: true, data: res.data };
			}
			return {
				success: true,
				data: res?.data,
			};
		},
		convertError: (res?: AxiosResponse): UseResult<UseResult> => {
			if (typeof res?.data === 'string') {
				return { success: false, message: res.data };
			}
			const { success, errorMessage, errorCode } = res?.data || {};
			return { success, message: errorMessage, code: errorCode };
		},
		handleCustomHttpError: (resError) => {
			if (resError instanceof AuthError) {
				if (resError.name == NotAuthorizedException.name) {
					return {
						success: false,
						status: 400,
						code: resError.name,
						message: 'ユーザーは無効になっています。',
					};
				} else if (resError.name == UserNotFoundException.name) {
					return {
						success: false,
						status: 400,
						code: resError.name,
						message: 'ユーザーは存在しません。',
					};
				}
			}
			return { success: false, status: 500, message: '未知の間違い' };
		},
		showSuccessMessage: (res: UseResult) => {
			toast.success(res.message);
		},
		showErrorMessage: async (res: UseResult) => {
			if (res.code == UserNotFoundException.name || res.code == NotAuthorizedException.name) {
			} else {
				if (res.message) {
					toast.error(res.message);
				}
			}
		},
		startLoading: () => {
			openLoading();
		},
		endLoading: () => {
			closeLoading();
		},
	};

	return <ArtProvider config={config} />;
};
