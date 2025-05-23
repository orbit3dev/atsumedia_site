import React, { FC, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { S3Domain } from '@atsumedia/amplify-client';
import { toast } from 'sonner';
import { FilePenLine, Plus, Trash2 } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';

type UploadProps = {
	value?: string;
	onChange: (value?: string) => void;
	isUpdate: boolean;
};
const UploadImg: FC<UploadProps> = ({ isUpdate, value, onChange }) => {
	const [loading, setLoading] = useState(false);
	// const [progress, setProgress] = useState(0);
	const [fileObjectUrl, setFileObjectUrl] = useState('');
	const uploadImage = () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();
		input.onchange = async () => {
			if (input.files && input.files.length > 0) {
				setLoading(true);
				const file = input.files[0];
				setFileObjectUrl(window.URL.createObjectURL(file));
				try {
					const result = await uploadData({
						// path: `public/news/content/image/${file.name}`,
						path: ({ identityId }) => `public/news/image/${identityId}/${file.name}`,
						data: file,
						options: {
							contentType: file!.type,
							// metadata: {
							// 	'Cache-Control': 'max-age=31104000',
							// },
							// onProgress: ({ transferredBytes, totalBytes }) => {
							// 	if (totalBytes) {
							// 		setProgress((transferredBytes / totalBytes) * 100);
							// 	}
							// },
						},
					}).result;
					onChange(result.path);
				} catch (err) {
					toast.error('Image upload failed');
					setFileObjectUrl('');
					console.log(err);
				}
				setLoading(false);
			}
		};
	};
	const removeImage = () => {
		setFileObjectUrl('');
		onChange('');
	};

	return (
		<div className={'group relative min-h-[200px] w-[300px] min-w-[300px] overflow-hidden rounded-md bg-gray-200'}>
			<div className={'absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center'}>
				{isUpdate ? (
					<>{value && <img src={S3Domain + '/' + value} alt={''} width={300} />}</>
				) : (
					<>{fileObjectUrl && <img src={fileObjectUrl} width={300} />}</>
				)}
			</div>
			{loading && (
				<div
					className={
						'absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center space-x-4 rounded-md border bg-black/60 text-2xl text-white'
					}>
					<ReloadIcon className="h-7 w-7 animate-spin" />
				</div>
			)}

			{isUpdate || fileObjectUrl ? (
				<div
					className={
						'absolute bottom-0 left-0 right-0 top-0 hidden items-center justify-center space-x-4 rounded-md border text-white group-hover:flex group-hover:bg-black/60'
					}>
					<FilePenLine onClick={uploadImage} />
					<Trash2 onClick={removeImage} />
				</div>
			) : (
				<div
					onClick={uploadImage}
					className={
						'absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center space-x-4 rounded-md border text-gray-700'
					}>
					<Plus className="h-7 w-7" />
				</div>
			)}
		</div>
	);
};

export default UploadImg;
