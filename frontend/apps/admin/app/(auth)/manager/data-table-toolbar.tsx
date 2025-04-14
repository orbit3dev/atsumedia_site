'use client';

import { Button } from '@atsumedia/shared-ui';
import React from 'react';
import { Plus } from 'lucide-react';

interface DataTableToolbarProps {
	onOpen: () => Promise<boolean>;
	query: () => Promise<unknown>;
}

const DataTableToolbar: React.FC<DataTableToolbarProps> = ({ onOpen, query }) => {
	return (
		<div className="mb-2 flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2"></div>
			<Button
				variant="outline"
				className="mx-2 h-9 px-2 lg:px-3"
				onClick={async () => {
					const success = await onOpen();
					if (success) {
						query().then();
					}
				}}>
				<Plus className="mr-2 h-4 w-4" />
				新規
			</Button>
		</div>
	);
};

export { DataTableToolbar };
