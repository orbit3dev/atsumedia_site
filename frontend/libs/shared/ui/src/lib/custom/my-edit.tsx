import { Editor } from 'react-draft-wysiwyg';
import dynamic from 'next/dynamic';

const MyEditor = dynamic(() => import('react-draft-wysiwyg').then((res) => res.Editor), { ssr: false });
