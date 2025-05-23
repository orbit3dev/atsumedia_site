import './global.css';
import React from 'react';
import 'swiper/swiper-bundle.css';
// import { ConfigureAmplifyClientSide } from '@atsumedia/amplify-client';
import { GoogleAnalytics } from '@next/third-parties/google';
import Ats from './_components/ats';

export const metadata = {
	title: 'Welcome to atsumedia',
	description: 'atsumedia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ja">
			<body>
				{/* <ConfigureAmplifyClientSide /> */}
				{children}
			</body>
			{process.env.AWS_BRANCH == 'main' && <Ats />}
			<GoogleAnalytics gaId="G-3FGZF1E2BX" />
		</html>
	);
}
