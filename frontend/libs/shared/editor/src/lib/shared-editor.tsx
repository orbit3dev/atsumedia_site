'use client';
import React, { FC, memo, useEffect, useMemo, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Embed from '@editorjs/embed';
// @ts-ignore
import AnyButton from './plugins/my-button';
// @ts-ignore
import LinkTool from './plugins/link';
// @ts-ignore
import ImageTool from './plugins/my-image';
import './index.scss';
import { uploadData } from 'aws-amplify/storage';
import { toast } from 'sonner';
// @ts-ignore
import Paragraph from 'editorjs-paragraph-with-alignment';
// @ts-ignore
import Header from 'editorjs-header-with-alignment';

type SharedEditorProps = {
	defaultValue?: string;
	readOnly?: boolean;
	value?: string;
	onChange?: (value: string) => void;
};

const setId = () => {
	const blockElementList = document.querySelectorAll('.ce-block');
	blockElementList.forEach((item) => {
		const id = item.getAttribute('data-id');
		if (id) {
			item.setAttribute('id', id);
		}
	});
};

export const SharedEditor: FC<SharedEditorProps> = memo(({ defaultValue, value, onChange, readOnly }) => {
	const ejInstance = useRef<EditorJS>();
	const data = useMemo(() => {
		try {
			return defaultValue ? JSON.parse(defaultValue) : '';
		} catch (e) {
			return '';
		}
	}, [defaultValue]);
	const initEditor = () => {
		const editor = new EditorJS({
			holder: 'editorjs',
			data,
			readOnly,
			i18n: {
				messages: {
					ui: {
						popover: {
							Filter: 'フィルター',
							'Nothing found': '見つかりません',
							'Convert to': '変換',
							search: '検索',
						},
					},
					toolNames: {
						Text: 'テキスト',
						Heading: '見出し',
						Link: 'リンク',
						Button: 'ボタン',
						Image: '画像',
					},
					blockTunes: {
						delete: {
							Delete: '削除',
							'Click to delete': '削除するにはクリック',
						},
						moveUp: {
							'Move up': '上へ移動',
						},
						moveDown: {
							'Move down': '下へ移動',
						},
					},
					tools: {
						header: {
							'Heading 2': '見出し2',
							'Heading 3': '見出し3',
							'Heading 4': '見出し4',
						},
						linkTool: {
							Link: 'リンクURL',
						},
						AnyButton: {
							'Title Text': 'タイトルテキスト',
							'Button Text': 'ボタンテキスト',
							'Link Url': 'リンクURL',
							Set: 'セット',
						},
						image: {
							'Select an Image': '画像選択',
							'With border': '枠線付き',
							'Stretch image': '画像リサイズ',
							'With background': '背景付き',
						},
					},
				},
			},
			tools: {
				paragraph: {
					class: Paragraph,
				},
				header: {
					// @ts-ignore
					class: Header,
					config: {
						levels: [2, 3, 4],
						defaultLevel: 2,
					},
				},
				linkTool: {
					// @ts-ignore
					class: LinkTool,
					config: {
						endpoint: '/api/fetchUrl', // Your backend endpoint for url data fetching,
					},
				},
				embed: {
					// @ts-ignore
					class: Embed,
					inlineToolbar: true,
					config: {
						services: {
							youtube: true,
							coub: true,
						},
					},
				},
				AnyButton: {
					// @ts-ignore
					class: AnyButton,
					inlineToolbar: false,
					config: {
						css: {
							btnColor: 'btn--gray-1',
						},
					},
				},
				image: {
					// @ts-ignore
					class: ImageTool,
					config: {
						uploader: {
							uploadByFile(file: File) {
								const up = uploadData({
									// path: `public/news/content/image/${file.name}`,
									path: ({ identityId }) => `public/news/content/image/${identityId}/${file.name}`,
									data: file,
									options: {
										contentType: file!.type,
										// metadata: {
										// 	'Cache-Control': 'max-age=31104000',
										// },
									},
								}).result;
								return up
									.then((res) => {
										return {
											success: 1,
											file: {
												url: S3Domain + '/' + res.path,
												// any other image data you want to store, such as width, height, color, extension, etc
											},
										};
									})
									.catch((err) => {
										toast.error('Image upload failed');
										console.log(err);
										return {
											success: 0,
										};
									});
							},
						},
					},
				},
			},
			onReady: () => {
				ejInstance.current = editor;
				if (readOnly) {
					setId();
				}
			},
			autofocus: false,
			onChange: async () => {
				const content = await editor.saver.save();
				if (onChange) {
					onChange(JSON.stringify(content));
				}
			},
		});
	};

	useEffect(() => {
		if (!ejInstance.current) {
			initEditor();
		}
		return () => {
			ejInstance?.current?.destroy();
			ejInstance.current = undefined;
		};
	}, []);

	return (
		<>
			<div id="editorjs"></div>
		</>
	);
});
