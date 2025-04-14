'use client';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { cn } from '@atsumedia/shared-util';

type ChildrenFunction<T> = (control: Control<T>) => React.ReactNode;

export type Control<T = void, R = unknown> = {
	isOpen: boolean;
	data: T;
	onClose: (result?: R) => void;
};

type ModalTitleFun<T> = (data: T) => string;

interface ModalProps<T> {
	title?: string | ModalTitleFun<T>;
	description?: string;
	children?: ChildrenFunction<T>;
	control: Control<T>;
	className?: string;
}

function Modal<T>({ title, description, children, control, className }: ModalProps<T>) {
	const [isMoment, setMoment] = useState(false);

	useEffect(() => {
		setMoment(true);
	}, []);

	if (!isMoment) {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	const onChange = (open: boolean) => {
		if (!open) {
			control.onClose();
		}
	};

	const childrenFun = children;

	return (
		<Dialog open={control.isOpen} onOpenChange={onChange}>
			<DialogContent className={className}>
				{title && (
					<DialogHeader>
						<DialogTitle>{typeof title == 'function' ? title(control.data) : title}</DialogTitle>
						{description && <DialogDescription>{description}</DialogDescription>}
					</DialogHeader>
				)}
				{control.isOpen && childrenFun && <div>{childrenFun(control)}</div>}
			</DialogContent>
		</Dialog>
	);
}

interface ModalFooterProps {
	buttonType?: 'cancel' | 'submit';
	cancelText?: string;
	confirmText?: string;
	onClose?: (result?: unknown) => void;
	onSubmit?: (result?: unknown) => void;
}
// eslint-disable-next-line react/display-name
const ModalFooter: React.FC<ModalFooterProps> = memo(({ buttonType, onClose, onSubmit, cancelText, confirmText }) => {
	return (
		<DialogFooter className="mt-5 flex flex-row justify-center space-x-2">
			{(buttonType === 'cancel' || buttonType === undefined) && (
				<Button
					className="w-1/2"
					variant="outline"
					onClick={() => {
						if (onClose) {
							onClose();
						}
					}}>
					{cancelText ?? '取消'}
				</Button>
			)}
			{(buttonType === 'submit' || buttonType === undefined) && (
				<Button
					className="w-1/2"
					autoFocus
					onClick={() => {
						if (onSubmit) {
							onSubmit();
						}
					}}>
					{confirmText ?? '确定'}
				</Button>
			)}
		</DialogFooter>
	);
});

function useModal<T = unknown>(): ModalType<T> {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [data, setData] = React.useState<T>();

	const openResolve = useRef<(value: unknown) => void>(() => ({}));

	/**
	 * 打开模态框
	 * @param data 参数
	 */
	function onOpen<R = unknown>(data?: T) {
		setIsOpen(true);
		if (data) {
			setData(data);
		}
		return new Promise<R>((resolve) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			openResolve.current = resolve;
		});
	}

	/**
	 * 关闭模态框
	 */
	const onClose = (result?: unknown) => {
		openResolve.current(result);
		setIsOpen(false);
		setData(undefined);
	};

	return { isOpen, onOpen, onClose, control: { data, isOpen, onClose } as Control<T> };
}

export type ModalType<T> = {
	isOpen: boolean;
	onOpen: <R>(data?: T) => Promise<R>;
	onClose: (result?: unknown) => void;
	control: Control<T>;
};

export type PropsWithModal<T, R, P extends object = Record<string, unknown>> = Control<T, R> &
	Pick<P, Exclude<keyof P, keyof Control>>;

type ModelType<T, P extends object = Record<string, unknown>> = ModalProps<T> &
	Pick<P, Exclude<keyof P, keyof Control>>;

function modal<T = unknown, R = unknown, P extends object = Record<string, unknown>>(
	Component: React.ComponentType<PropsWithModal<T, R, P>>
) {
	// eslint-disable-next-line react/display-name
	return memo((props: ModelType<T, P>) => {
		const { title, description, control, className, children, ...other } = props;

		const { isOpen, ...controlOther } = control;
		const targetProps = { ...controlOther, ...other };

		return (
			<Modal<T> control={control} title={title} className={className} description={description}>
				{() => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					return <Component {...targetProps} />;
				}}
			</Modal>
		);
	});
}

export { Modal, ModalFooter, useModal, modal };
