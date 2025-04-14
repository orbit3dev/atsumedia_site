import { useLoading } from '@atsumedia/shared-ui';
import { signOut } from 'aws-amplify/auth';
import { useEffect } from 'react';

export const useSignOut = () => {
	const { closeLoading, openLoading } = useLoading();

	const _signOut = async () => {
		openLoading();
		await signOut();
	};

	useEffect(() => {
		return () => closeLoading();
	}, []);

	return { signOut: _signOut };
};
