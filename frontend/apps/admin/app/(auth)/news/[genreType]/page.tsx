import EditForm from '@admin/(auth)/news/edit-form';

import { format } from 'date-fns';
import { LayoutContent } from '@admin/(auth)/_components/layout-content';
import React from 'react';

const Page = ({ params }: { params: { genreType: string } }) => {
	return (
		<LayoutContent breadcrumb={[{ name: 'ニュース', href: '/news' }, { name: '新規' }]}>
			<EditForm
				data={{
					title: '',
					datetime: format(new Date(), 'yyyy-MM-dd'),
					genreType: params.genreType,
					isTop: 0,
					outline: '',
					isPublic: 0,
					titleMeta: '',
					descriptionMeta: '',
					content: '',
					image: '',
					pathName: '',
					author: {
						name: '',
						image: '',
						description: '',
						banner: '',
					},
				}}></EditForm>
		</LayoutContent>
	);
};

export default Page;
