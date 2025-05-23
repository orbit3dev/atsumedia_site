import type { Schema } from '@atsumedia/amplify-backend';
import { CategoryType } from '@atsumedia/data';
import { usePagination } from '@sevenvip666/react-art';
import { userPoolClient } from '@atsumedia/amplify-client';
import { useColumns } from '@admin/(auth)/news/columns';
import { DataTable } from '@atsumedia/shared-ui';
import React from 'react';
import { DataTableToolbar } from '@admin/(auth)/news/data-table-toolbar';

export type NewsType = Schema['News']['type'];
const selectionSet = [
  'id',
  'title',
  'type',
  'datetime',
  'genreType',
  'isTop',
  'outline',
  'isPublic',
  'titleMeta',
  'descriptionMeta',
  'image',
  'pathName',
];
export type NewsTableType = NewsType;

type TabTableProps = {
  genreType: CategoryType;
};

export function NewsTable({ genreType }: TabTableProps) {
  const store = usePagination<NewsTableType[], { limit: number; content: string }>(
    ({ limit, nextToken, content }) => {
      const params = {
        genreType: !content ? genreType : undefined,
        genreTypeCopy: content ? genreType : undefined,
        limit,
        nextToken,
        selectionSet,
        titleDatetime: content
          ? {
            beginsWith: {
              title: content,
            },
          }
          : undefined,
        sortDirection: 'DESC',
      };
      if (content) {
        // @ts-ignore
        return userPoolClient.models.News.listByGenreTypeTitle(params);
      } else {
        // @ts-ignore
        return userPoolClient.models.News.listByGenreType(params);
      }
      // @ts-ignore
      // return userPoolClient.models.News.listByGenreType(params);
    },
    {
      getNextToken: (res) => res.nextToken,
    },
  );
  const columns = useColumns({ store });
  return (
    <>
      <DataTable
        columns={columns}
        store={store}
        toolbar={() => <DataTableToolbar store={store} genreType={genreType} />}
      />
    </>
  );
}
