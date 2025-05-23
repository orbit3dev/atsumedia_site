'use server';

import { revalidatePath } from 'next/cache';

export default async function revalidate() {
	revalidatePath('/news/[genreType]/[id]', 'page');
}
