import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export type SessionInfo = {
	username: string;
	groups: string[];
	email: string;
};

type UserAuthState = {
	sessionInfo?: SessionInfo;
};

type UserAuthFunction = {
	setSessionInfo: (sessionInfo: SessionInfo) => void;
};

type UserAuthType = UserAuthState & UserAuthFunction;

const initData: UserAuthState = {
  sessionInfo: undefined,
};
export const userAuthStore = createWithEqualityFn<UserAuthType>(
	(set) => ({
		...initData,
		setSessionInfo: (sessionInfo) => {
			set({ sessionInfo });
		},
	}),
	shallow
);
