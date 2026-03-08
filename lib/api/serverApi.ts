import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { AxiosResponse } from 'axios';

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();

  return {
    Cookie: cookieStore.toString(),
  };
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<{ notes: Note[]; total: number }> => {
  const headers = await getAuthHeaders();
  const { data } = await api.get('/notes', {
    params,
    headers,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getAuthHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getAuthHeaders();
  const { data } = await api.get<User>('/users/me', { headers });
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User>> => {
  const headers = await getAuthHeaders();

  return api.get<User>('/auth/session', { headers });
};
