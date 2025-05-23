'use client';
import { Authenticator } from '@aws-amplify/ui-react';
import { PropsWithChildren } from 'react';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => (
	<Authenticator.Provider>
		{children}
	</Authenticator.Provider>
);
