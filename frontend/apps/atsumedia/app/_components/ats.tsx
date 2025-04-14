'use client';
import React, { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const Ats = () => {
	const pathname = usePathname();

	useEffect(() => {
		window.anymindTS && window.anymindTS.dispose && window.anymindTS.dispose();
		window.startAnymindTS && window.startAnymindTS();
	}, [pathname]);

	return (
		<>
			<Script src="//anymind360.com/js/1668/ats.js" />
		</>
	);
};

export default Ats;
