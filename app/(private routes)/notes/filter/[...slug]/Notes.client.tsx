'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import type { Note } from '@/types/note';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import EmptyState from '@/components/EmptyState/EmptyState';
import SearchBox from '@/components/SearchBox/SearchBox';

import { fetchNotes } from '@/lib/api/clientApi';
import css from './Notes.client.module.css';

const perPage = 12;
const VALID_TAGS = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface Props {
  initialTag: string;
}

interface NotesResponse {
  notes: Note[];
  total: number;
}

export default function NotesClient({ initialTag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebounce(search, 500);

  const activeTag = VALID_TAGS.includes(initialTag) ? initialTag : '';

  const { data, isLoading, isError, isFetching } = useQuery<NotesResponse>({
    queryKey: ['notes', activeTag, page, debouncedSearch],

    queryFn: () =>
      fetchNotes({
        tag: activeTag,
        page,
        perPage,
        search: debouncedSearch,
      }),

    placeholderData: previous => previous,
    staleTime: 60 * 1000,
  });

  const totalPages = data ? Math.ceil(data.total / perPage) : 0;

  const handlePageChange = (newPage: number) => {
    if (!data) return;

    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className={css.app} key={initialTag}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} initialValue={search} />

        {data && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}

      {!isLoading && !isError && data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          {isFetching && <div className={css.fetchingLoader}>Updating...</div>}
        </>
      )}

      {!isLoading && !isError && data && data.notes.length === 0 && (
        <EmptyState message={search ? 'No notes match your search' : 'No notes in this category'} />
      )}
    </div>
  );
}
