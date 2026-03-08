import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';

import NotePreviewClient from './NotePreview.client';
import { fetchNoteById } from '@/lib/api/serverApi';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
