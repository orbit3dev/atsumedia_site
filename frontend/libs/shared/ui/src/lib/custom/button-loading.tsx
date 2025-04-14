import { ReloadIcon } from '@radix-ui/react-icons';
import { Button, buttonVariants } from '@atsumedia/shared-ui';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';

export interface ButtonLoadingProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
	({ isLoading, children, disabled, ...props }, ref) => {
		return (
			<Button ref={ref} disabled={isLoading ? true : disabled} {...props}>
				{isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
				{children}
			</Button>
		);
	}
);
Button.displayName = 'ButtonLoading';

export { ButtonLoading };
