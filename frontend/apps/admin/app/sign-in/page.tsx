'use client';

import './sign-in.css';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator, translations, useAuthenticator } from '@aws-amplify/ui-react';
import React, { startTransition, useEffect } from 'react';
import { I18n } from 'aws-amplify/utils';
import { AppLoading } from '@atsumedia/shared-ui';
import { USER_POOL_GROUP_ADMINS } from '@atsumedia/amplify-backend';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
I18n.putVocabularies(translations);
I18n.setLanguage('ja');

I18n.putVocabulariesForLanguage('ja', {
	'Incorrect username or password.': '不正なユーザー名またはパスワード',
	'Password must have at least 8 characters': 'パスワードは少なくとも8文字必要です',
	'Password must have lower case letters': 'パスワードには小文字を使用する必要があります',
	'Password must have upper case letters': 'パスワードには大文字を使用する必要があります',
	'Password must have special characters': 'パスワードには特殊文字を含める必要があります',
	'Password must have numbers': 'パスワードには数字が必要です',
	'Your passwords must match': 'パスワードには特殊文字を含める必要があります',
	'Invalid verification code provided, please try again.': '提供された検証コードは無効です、再試行してください。',
	'PreTokenGeneration failed with error No Auth.': '許可が拒否されました',
});
export default function Page() {
	const { authStatus } = useAuthenticator((context) => [context.authStatus]);
	const router = useRouter();

	useEffect(() => {
		if (authStatus === 'authenticated') {
			startTransition(() => router.push('/'));
			startTransition(() => router.refresh());
		}
	}, [authStatus]);

	if (authStatus === 'configuring') {
		return <AppLoading />;
	}

	return (
		<main className="flex h-screen w-screen flex-col">
			<Authenticator
				hideSignUp={true}
				services={{
					handleSignIn: (props) => {
						return signIn({
							...props,
							options: {
								...props.options,
								clientMetadata: {
									mode: USER_POOL_GROUP_ADMINS,
								},
							},
						});
					},
				}}
				className="flex-1"></Authenticator>
		</main>
	);
}
