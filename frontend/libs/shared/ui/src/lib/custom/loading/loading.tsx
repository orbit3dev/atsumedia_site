import resso from 'resso';

type LoadingStoreType = {
	loading: boolean;
	closeLoading: () => void;
	openLoading: () => void;
};

export const loadingStore = resso<LoadingStoreType>({
	loading: false,
	closeLoading: () => {
		loadingStore.loading = false;
	},
	openLoading: () => {
		loadingStore.loading = true;
	},
});

export const useLoading = () => {
	const { loading, openLoading, closeLoading } = loadingStore;
	return { loading, openLoading, closeLoading };
};
