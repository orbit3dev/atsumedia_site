'use client';
import React, { PropsWithChildren, useEffect } from 'react';
import { SessionInfo, userAuthStore } from '@admin/_lib/auth/auth-user';

type AuthProps = {
	sessionInfo: SessionInfo;
};

export const logoutPrompt = 'logoutPrompt';

const AuthClient: React.FC<PropsWithChildren<AuthProps>> = ({ children, sessionInfo }) => {
	const setSessionInfo = userAuthStore((state) => state.setSessionInfo);
	useEffect(() => {
		setSessionInfo(sessionInfo);
	}, []);
	return <>{children}</>;
};

export { AuthClient };
