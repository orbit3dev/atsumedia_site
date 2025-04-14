'use client';

import { ColumnDef, Table } from '@tanstack/react-table';

import { Checkbox } from '@atsumedia/shared-ui';
import { AddArticleTableType } from '@admin/(auth)/_components/add-article/add-article-table';

export function useAddArticleColumns({
	selectedList,
	selectedRowsOnChange,
}: {
	selectedList: AddArticleTableType[];
	selectedRowsOnChange: (selected: boolean, rows: AddArticleTableType[]) => void;
}): ColumnDef<AddArticleTableType>[] {
	const checked = (table: Table<any>) => {
		const selectItems = table
			.getRowModel()
			.rows.filter((row) => selectedList.some(({ id }) => id == row.original.id));
		if (selectItems.length == 0) {
			return false;
		}
		if (selectItems.length == table.getRowModel().rows.length) {
			return true;
		}
		return 'indeterminate';
	};
	return [
		{
			id: 'select',
			header: ({ table }) => (
				<div className={'w-[28px] text-center'}>
					<Checkbox
						className={'data-[state=checked]:-my-[2px] data-[state=checked]:translate-y-[2px]'}
						checked={checked(table)}
						onCheckedChange={(value) => {
							selectedRowsOnChange(
								value == 'indeterminate' ? false : value,
								table.getRowModel().rows.map((item) => item.original)
							);
							// table.toggleAllPageRowsSelected(!!value);
						}}
						aria-label="Select all"
					/>
				</div>
			),
			cell: ({ row }) => (
				<Checkbox
					className={'data-[state=checked]:-my-[2px] data-[state=checked]:translate-y-[2px]'}
					// checked={row.getIsSelected()}
					checked={selectedList.map((item) => item.id).includes(row.original.id)}
					onCheckedChange={(value) => {
						selectedRowsOnChange(value == 'indeterminate' ? false : value, [row.original]);
						// row.toggleSelected(!!value);
					}}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'id',
			header: () => {
				return <div className="min-w-[90px] text-center">ID</div>;
			},
			cell: ({ row }) => {
				const id = row.getValue<string>('id');
				return <div className="min-w-[90px] text-center">{id}</div>;
			},
		},
		{
			accessorKey: 'titleMeta',
			header: 'タイトル',
			cell: ({ row }) => (
				<div className={'w-full min-w-[600px] truncate'}>
					{row.original.titleMeta}
					{row.original.titleMeta}
				</div>
			),
		},
	];
}
