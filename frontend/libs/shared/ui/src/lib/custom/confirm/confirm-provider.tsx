'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@atsumedia/shared-ui';

type ConfirmType = {
	isOpen: boolean;
	title?: string;
	description?: string;
	buttonType?: 'cancel' | 'submit' | 'none';
	cancelText?: string;
	confirmText?: string;
	result: boolean;
};

const confirmStore = createWithEqualityFn<ConfirmType>(
	() => ({
		result: false,
		isOpen: false,
	}),
	shallow
);

export const useConfirm = () => {
	const isOpen = confirmStore((state) => state.isOpen);
	const result = confirmStore((state) => state.result);
	const openResolve = useRef<(result: boolean) => void>(() => ({}));
	const open = (config: Omit<ConfirmType, 'isOpen' | 'result'>) => {
		confirmStore.setState({ ...config, isOpen: true });
		return new Promise((resolve) => {
			openResolve.current = resolve;
		});
	};
	const close = () => {
		confirmStore.setState({ isOpen: false });
		setTimeout(() => {
			confirmStore.setState({ isOpen: false }, true);
		}, 150);
	};

	useEffect(() => {
		if (!isOpen) {
			openResolve.current(result);
			openResolve.current = () => ({});
		}
	}, [isOpen, result]);
	return { open, close };
};

const ConfirmProvider: React.FC = () => {
	const { isOpen, title, description, buttonType, confirmText, cancelText } = confirmStore((state) => state);

	const [isMoment, setMoment] = useState(false);

	const onClose = useCallback(() => {
		close(false);
	}, []);

	const onSubmit = useCallback(() => {
		close(true);
	}, []);

	const close = useCallback((result: boolean) => {
		confirmStore.setState({ isOpen: false, result });
		setTimeout(() => {
			confirmStore.setState({ isOpen: false }, true);
		}, 100);
	}, []);

	useEffect(() => {
		setMoment(true);
	}, []);

	if (!isMoment) {
		return <></>;
	}

	return (
		<AlertDialog open={isOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				{buttonType !== 'none' && (
					<AlertDialogFooter>
						{(buttonType === 'cancel' || buttonType === undefined) && (
							<AlertDialogCancel onClick={() => onClose()}>{cancelText ?? '取消'}</AlertDialogCancel>
						)}
						{(buttonType === 'submit' || buttonType === undefined) && (
							<AlertDialogCancel onClick={() => onSubmit()}>{confirmText ?? '確定'}</AlertDialogCancel>
						)}
					</AlertDialogFooter>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
};

export { ConfirmProvider };
