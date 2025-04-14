import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	AppPaginationPrevious,
	AppPaginationNext,
	AppPaginationLink,
} from '../ui/pagination';
import React from 'react';
import { type QueryInfiniteStoreType } from '@sevenvip666/react-art';

type AppDataTablePaginationProps<TData> = {
	store: QueryInfiniteStoreType<TData[]>;
};

export function AppDataTablePagination<TData>({ store }: AppDataTablePaginationProps<TData>) {
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
		<Pagination className="justify-center py-16">
			<PaginationContent>
				<PaginationItem aria-disabled={true}>
					<AppPaginationPrevious
						disabled={current - 1 <= 0}
						onClick={() => queryNextPage({ current: current - 1 })}
					/>
				</PaginationItem>
				{pageTokens.length > 10 && (
					<>
						<PaginationItem>
							<AppPaginationLink
								isActive={current === 1}
								disabled={isLoading || isLoadingNextPage}
								onClick={() => queryNextPage({ current: 1 })}
								className={'!bg-transparent'}>
								1
							</AppPaginationLink>
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
							<AppPaginationLink
								isActive={current === target}
								onClick={() => {
									window.history.replaceState({ page: target }, '', '?page=' + target);
									queryNextPage({ current: target });
								}}
								className={`!bg-transparent ${current === target ? 'text-[#f0f0f0]' : 'text-black'}`}>
								{target}
							</AppPaginationLink>
						</PaginationItem>
					);
				})}

				<PaginationItem>
					<AppPaginationNext
						disabled={isLoading || isLoadingNextPage || !hasNextPage}
						onClick={() => queryNextPage()}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
