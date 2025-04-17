export const rootHostname = 'https://www.at-s.com';
export const rootMainHostname = 'https://main.d3lpyf0nhbpqh3.amplifyapp.com';
export const rootDevHostname = 'https://dev.d3lpyf0nhbpqh3.amplifyapp.com';
export const rootTestHostname = 'https://test.d3lpyf0nhbpqh3.amplifyapp.com';
export const basePath = 'test/frontend/';
export const articlePath = 'articles';

export const rootHost = () => {
	switch (process.env.AWS_BRANCH) {
		case 'main':
			return rootHostname;
		case 'dev':
			return rootDevHostname;
		default:
			return rootTestHostname;
	}
};

export const getBasePath = (url: string) => {
	if (basePath.length) {
		const cleanBase = basePath.replace(/\/$/, '');
		const cleanUrl = url.replace(/^\//, '');
		return basePath.length ? `/${cleanBase}/${cleanUrl}` : url;
	}
	return url;
};

export const isExternalDomain = (url: string) => {
	try {
		const linkUrl = new URL(url);
		return (
			linkUrl.hostname !== new URL(rootHost()).hostname && linkUrl.hostname !== new URL(rootMainHostname).hostname
		);
	} catch (e) {
		return true;
	}
};

export const isExternalDomainExtended = (url: string) => {
	try {
        const linkUrl = new URL(url);
        let isExternal = false;
        try {
            isExternal = linkUrl.hostname !== new URL(rootMainHostname).hostname && linkUrl.hostname !== new URL(rootDevHostname).hostname && linkUrl.hostname !== new URL(rootTestHostname).hostname && linkUrl.hostname !== new URL(rootHostname).hostname;
        } catch (e) {
            isExternal = true;
        }

		if (!isExternal) {
			// Check if the path URL starting with /media if not, then it's an external domain
			const linkUrl = new URL(url);
			const path = linkUrl.pathname;
			const isMediaPath = path.startsWith(`/${basePath}`);
			return !isMediaPath;
		} else {
			return true;
		}
	} catch (e) {
		return true;
	}
};

export const isAdvertisement = (text: string) => {
	try {
		if (
			(text.includes('\\') && text.includes('/', text.indexOf('\\') + 1)) ||
			(text.includes('＼') && text.includes('/', text.indexOf('＼') + 1))
		) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return true;
	}
};
