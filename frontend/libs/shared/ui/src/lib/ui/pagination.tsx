import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@atsumedia/shared-util';
import { Button, ButtonProps, buttonVariants } from '@atsumedia/shared-ui/ui/lib/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
	<nav
		role="navigation"
		aria-label="pagination"
		className={cn('mx-auto flex w-full justify-center', className)}
		{...props}
	/>
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
	({ className, ...props }, ref) => (
		<ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
	)
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
	<li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
	isActive?: boolean;
	disabled?: boolean;
} & Pick<ButtonProps, 'size'> &
	React.ComponentProps<'a'>;

const PaginationLink = ({ className, isActive, disabled = false, size = 'icon', ...props }: PaginationLinkProps) => (
	<Button
		aria-current={isActive ? 'page' : undefined}
		disabled={disabled}
		className={`p-0 ${cn(
			buttonVariants({
				variant: isActive ? 'secondary' : 'hover',
				size,
			}),
			className
		)} h-8 w-auto min-w-[32px]`}>
		<a {...props} aria-disabled={true} className="flex h-full w-full items-center justify-center" />
	</Button>
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, disabled, ...props }: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink
		aria-label="Go to previous page"
		size="default"
		disabled={disabled}
		className={cn('gap-1 p-0', className)}
		{...props}>
		<span className="flex items-center px-2 py-4">
			<ChevronLeft className="h-4 w-4" />
			<span>前のページ</span>
		</span>
	</PaginationLink>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, disabled, ...props }: React.ComponentProps<typeof PaginationLink>) => (
	<PaginationLink
		aria-label="Go to next page"
		size="default"
		disabled={disabled}
		className={cn('gap-1 p-0', className)}
		{...props}>
		<span className="flex items-center px-2 py-4">
			<span>次のページ</span>
			<ChevronRight className="h-4 w-4" />
		</span>
	</PaginationLink>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
	<span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
		<MoreHorizontal className="h-4 w-4" />
		<span className="sr-only">More pages</span>
	</span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

const AppPaginationLink = ({ className, isActive, disabled = false, size = 'icon', ...props }: PaginationLinkProps) => (
	<Button
		aria-current={isActive ? 'page' : undefined}
		disabled={disabled}
		className={`bg-transparent p-0 ${cn(
			buttonVariants({
				variant: isActive ? 'secondary' : 'hover',
				size,
			}),
			className
		)} h-[30px] w-auto min-w-[30px]`}>
		<a {...props} aria-disabled={true} className="flex h-full w-full items-center justify-center text-[17px]" />
	</Button>
);
AppPaginationLink.displayName = 'AppPaginationLink';

const AppPaginationPrevious = ({ className, disabled, ...props }: React.ComponentProps<typeof PaginationLink>) => (
	<AppPaginationLink
		aria-label="Go to previous page"
		size="default"
		disabled={disabled}
		className={`p-0 ${cn(className)} mr-3 !h-14 !min-w-14 rounded-full bg-black text-white`}
		{...props}>
		<span className="flex h-full w-full items-center justify-center">
			<ChevronLeft className="h-6 w-6" />
		</span>
	</AppPaginationLink>
);
AppPaginationPrevious.displayName = 'AppPaginationPrevious';

const AppPaginationNext = ({ className, disabled, ...props }: React.ComponentProps<typeof PaginationLink>) => (
	<AppPaginationLink
		aria-label="Go to next page"
		size="default"
		disabled={disabled}
		className={`p-0 ${cn(className)} ml-3 !h-14 !min-w-14 rounded-full bg-black text-white`}
		{...props}>
		<span className="flex h-full w-full items-center justify-center">
			<ChevronRight className="h-6 w-6" />
		</span>
	</AppPaginationLink>
);
AppPaginationNext.displayName = 'AppPaginationNext';

export {
	Pagination,
	PaginationContent,
	PaginationLink,
	PaginationItem,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
	AppPaginationLink,
	AppPaginationPrevious,
	AppPaginationNext,
};
