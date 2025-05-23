import React, { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

const NoSsr: React.FC<PropsWithChildren> = ({ children }) => {
	return <React.Fragment>{children}</React.Fragment>;
};

export default dynamic(() => Promise.resolve(NoSsr), {
	ssr: false,
});
