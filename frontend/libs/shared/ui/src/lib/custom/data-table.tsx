'use client';
import React, { CSSProperties, useState } from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { QueryInfiniteStoreType, QueryStoreType } from '@sevenvip666/react-art';
import { DataTablePagination } from '@atsumedia/shared-ui/ui/lib/custom/data-table-pagination';
import { AppLoading, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@atsumedia/shared-ui';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@atsumedia/shared-util';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	store: QueryInfiniteStoreType<TData[]> | QueryStoreType<TData[]>;
	toolbar?: () => React.ReactNode;
	childNode?: (item: TData) => React.ReactNode;
	className?: string;
}

const isPageFun = (store: any) => {
	try {
		return !!store['queryByPage'];
	} catch (e) {
		return false;
	}
};

export function DataTable<TData, TValue>({
	columns,
	store,
	toolbar,
	childNode,
	className,
}: DataTableProps<TData, TValue>) {
	const isPage = isPageFun(store);
	return (
		<div>
			{toolbar && toolbar()}
			<div className={cn('relative rounded-md border', className)}>
				{isPage ? <TableInfiniteLoading store={store} /> : <TableLoading store={store} />}
				<TableContext columns={columns} store={store} childNode={childNode} />
			</div>
			{isPage && <DataTablePagination store={store as QueryInfiniteStoreType<TData[]>} />}
		</div>
	);
}

interface TableContextProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	store: QueryInfiniteStoreType<TData[]> | QueryStoreType<TData[]>;
	childNode?: (item: TData) => React.ReactNode;
}

function TableContext<TData, TValue>({ columns, store, childNode }: TableContextProps<TData, TValue>) {
	const { data, isSuccess } = store;
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data: data ?? [],
		columns,
		state: {
			columnFilters,
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});
	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{!!childNode && <TableHead className="table-cell w-16 p-0" />}
						{headerGroup.headers.map((header) => {
							return (
								<TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{data?.length ? (
					table.getRowModel().rows.map((row) =>
						childNode ? (
							<TableCollapsible key={row.id} childNode={() => childNode(row.original)}>
								{({ trigger }) => {
									return (
										<TableRow data-state={row.getIsSelected() && 'selected'}>
											<TableCell className="table-cell w-16 p-0">{trigger()}</TableCell>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									);
								}}
							</TableCollapsible>
						) : (
							<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						)
					)
				) : (
					<TableRow>
						<TableCell colSpan={columns.length} className="h-24 text-center">
							{isSuccess ? ' 結果がありません' : ''}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

type TableCollapsibleProps = {
	children?: (props: { open: boolean; trigger: () => React.ReactNode }) => React.ReactNode;
	childNode: () => React.ReactNode;
};

function TableCollapsible({ childNode, children }: TableCollapsibleProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
			<>
				{children &&
					children({
						open: isOpen,
						trigger: () => (
							<CollapsibleTrigger asChild type={undefined} className="sticky top-12 z-40">
								<div className="flex items-center justify-between bg-white px-2 py-2">
									{isOpen ? (
										<ChevronUp className="text-gray-400" />
									) : (
										<ChevronDown className="text-gray-400" />
									)}
								</div>
							</CollapsibleTrigger>
						),
					})}
				<CollapsibleContent asChild>{childNode()}</CollapsibleContent>
			</>
		</Collapsible>
	);
}

interface TableLoadingProps<TData> {
	store: QueryInfiniteStoreType<TData[]> | QueryStoreType<TData[]>;
}

function TableInfiniteLoading<TData>({ store }: TableLoadingProps<TData>) {
	const { isLoading, isLoadingNextPage } = store as QueryInfiniteStoreType<TData[]>;
	return <TableLoadingNode loading={isLoading || isLoadingNextPage} />;
}

function TableLoading<TData>({ store }: TableLoadingProps<TData>) {
	const { isLoading } = store;
	return <TableLoadingNode loading={isLoading} />;
}

interface TableLoadingNodeProps {
	loading: boolean;
}
export function TableLoadingNode({ loading }: TableLoadingNodeProps) {
	return (
		loading && (
			<div className="absolute left-0 top-0 z-10 h-full w-full bg-white/80">
				<AppLoading size={'small'} />
			</div>
		)
	);
}
