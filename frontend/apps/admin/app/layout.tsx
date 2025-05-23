import './global.css';
import React from 'react';
import { ConfigureAmplifyClientSide } from '@atsumedia/amplify-client';
import { AuthProvider } from '@admin/_provider/auth-provider';
import { AuthListen } from '@admin/_lib/auth/auth-listen';
import { Toaster } from 'sonner';

export const metadata = {
	title: 'atsumedia ',
	description: 'atsumedia admin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ConfigureAmplifyClientSide />
				<Toaster />
				<AuthProvider>
					<AuthListen>{children}</AuthListen>
				</AuthProvider>
			</body>
		</html>
	);
}
