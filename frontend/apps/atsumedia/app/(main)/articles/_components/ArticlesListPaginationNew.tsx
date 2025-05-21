'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { getIsTopNewsList, getNewsListByGenreType, getNewsListByGenreTypeCategory } from '../../lib';
import { CategoryType, getCategoryByType, News , getCategoryColorByType } from '@atsumedia/data';
import Link from 'next/link';
import React from 'react';
import MyImage from '../../../(main)/_components/MyImage';


interface ArticlesListPaginationNewProps {
  defaultData: News[];
  totalPages: number;
  isCategory: boolean;
  type?: string;
}

const getPaginationRange = (current: number, total: number) => {
  const range = 2; // Number of pages to show around current
  const showEllipsis = 5; // When to start showing ellipsis

  let pages: (number | string)[] = [];

  if (total <= 7) {
    // Show all pages if total is small
    pages = Array.from({ length: total }, (_, i) => i + 1);
  } else {
    // Show dynamic range with ellipsis
    pages.push(1);

    if (current > range + 2) pages.push('...');

    const start = Math.max(2, current - range);
    const end = Math.min(total - 1, current + range);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - range - 1) pages.push('...');

    pages.push(total);
  }

  return pages;
};

export default function ArticlesListPaginationNew({
  defaultData,
  totalPages,
  isCategory,
  type,
}: ArticlesListPaginationNewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data } = useQuery({
    queryKey: ['newsList', type, currentPage],
    queryFn: async () => {
      const result = await getNewsListByGenreTypeCategory(
        isCategory,
        type ?? '',
        currentPage,
        18,
      );
      return result;
    },
    initialData: { newsList: defaultData, totalPages },
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-10">
      <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6">
        {data.newsList.map((item: News) => (
          <Link key={item.id} href={`articles/${item.genreType}/${item.pathName}/`}>
            <div className="relative w-full">
              <div className="relative w-full overflow-hidden rounded-lg pt-[56.5%] text-[0px] leading-none">
                <div className="absolute bottom-0 left-0 right-0 top-0">
                  <picture>
                    <MyImage
                              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105`}
                              visibleByDefault={true}
                              alt={item.titleMeta}
                              path={item.image}
                            />
                  </picture>
                </div>
              </div>
              <p
                className="absolute right-[4px] top-[4px] rounded-3xl leading-none text-white"
                style={{ backgroundColor: getCategoryColorByType(item.genreType) }}
              >
                <span className="inline-block scale-50 text-[20px]">
                  {getCategoryByType(item.genreType).name}
                </span>
              </p>
            </div>
            <h3 className="mt-3 line-clamp-2 text-[14px] font-bold md:text-[15px]">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-2">
        {getPaginationRange(currentPage, data.totalPages).map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-gray-500 select-none"
              >
                ...
              </span>
            );
          }
          const pageNumber = page as number;
          const isActive = currentPage === pageNumber;

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-2 rounded-md text-sm md:px-4 md:text-base ${isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}