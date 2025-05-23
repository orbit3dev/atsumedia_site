import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';
import React from 'react';
import { type QueryInfiniteStoreType } from '@sevenvip666/react-art';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@atsumedia/shared-ui/ui/lib/ui/select';

type DataTablePaginationProps<TData> = {
	store: QueryInfiniteStoreType<TData[]>;
};

export function DataTablePagination<TData>({ store }: DataTablePaginationProps<TData>) {
	const {
		current,
		data,
		pageSize,
		queryByPage,
		pageTokens,
		hasNextPage,
		queryNextPage,
		isLoading,
		isLoadingNextPage,
	} = store;

	return (
		<Pagination className="justify-end py-2">
			<PaginationContent>
				<PaginationItem aria-disabled={true}>
					<PaginationPrevious
						aria-label={'前のページ'}
						disabled={current - 1 <= 0}
						onClick={() => queryNextPage({ current: current - 1 })}
					/>
				</PaginationItem>
				<PaginationItem aria-disabled={true}>
					<Select
						disabled={false}
						defaultValue={(pageSize ?? 10)?.toString()}
						onValueChange={(value) => queryByPage({ current: 1, pageSize: parseInt(value) })}>
						<SelectTrigger className="h-8 w-[80px] py-0">
							<SelectValue placeholder="選んでください" className="text-sm text-gray-400" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{[10, 20, 50]?.map((item) => (
									<SelectItem key={item} value={item.toString()}>
										{item}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</PaginationItem>
				{pageTokens.length > 10 && (
					<>
						<PaginationItem>
							<PaginationLink
								isActive={current === 1}
								disabled={isLoading || isLoadingNextPage}
								onClick={() => queryNextPage({ current: 1 })}>
								1
							</PaginationLink>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
					</>
				)}
				{pageTokens.slice(Math.floor((current - 1) / pageSize) * pageSize).map((_, index) => {
					const target = Math.floor((current - 1) / pageSize) * pageSize + index + 1;
					return (
						<PaginationItem key={index}>
							<PaginationLink
								isActive={current === target}
								onClick={() => {
									window.history.replaceState({ page: target }, '', '?page=' + target);
									queryNextPage({ current: target });
								}}>
								{target}
							</PaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<PaginationNext
						disabled={isLoading || isLoadingNextPage || !hasNextPage}
						onClick={() => queryNextPage()}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
