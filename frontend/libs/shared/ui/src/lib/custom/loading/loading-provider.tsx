'use client';
import React, { PropsWithChildren } from 'react';
import { useLoading } from '@atsumedia/shared-ui/ui/lib/custom/loading/loading';
import { AppLoading } from '@atsumedia/shared-ui/ui/lib/custom/loading/app-loading';
import { Dialog, DialogOverlay } from '../../ui/dialog';

const LoadingProvider: React.FC<PropsWithChildren> = () => {
	const { loading } = useLoading();
	if (loading) {
		return (
			<Dialog open={loading}>
        <div className="fixed left-[50%] top-[50%] z-[51] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <AppLoading />
        </div>
        <DialogOverlay/>
			</Dialog>
		);
	}
	return null;
};

export { LoadingProvider };
