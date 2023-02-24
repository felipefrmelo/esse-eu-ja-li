import { Book, markBook } from '../domain/book';
import { Stats } from '../pages/profile';
import { AuthResponse } from '../providers/auth';

const API_URL = `http://${process.env.REACT_APP_HOST}/api`;
const RANK_URL = `http://${process.env.REACT_APP_HOST}/rank`;

class AuthError extends Error {
  constructor() {
    super('Email e/ou senha inválidos');
  }
}

class ServerError extends Error {
  constructor() {
    super('Servidor indisponível no momento. Tente novamente mais tarde.');
  }
}

let token: string | null = null;

const fetchApi = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  return response;
};

export const fetchLoginApi = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetchApi(`${API_URL}/auth`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw res.status >= 500 ? new ServerError() : new AuthError();

    const data = await res.json();
    token = data.access_token;

    return {
      data,
      status: res.status,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchBooksApi = async (search: string): Promise<Book[]> => {
  try {
    const res = await fetchApi(`${API_URL}/books?text=${search}`);

    if (!res.ok) throw new ServerError();

    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getUserBookByIdApi = async (bookId: string): Promise<Book> => {
  try {
    const res = await fetchApi(`${RANK_URL}/books/user?book_id=${bookId}`);

    if (!res.ok) throw new ServerError();

    const [book] = await res.json();

    if (!book) throw new Error('Book not found');

    return book;
  } catch (error) {
    throw error;
  }
};

export const handleMarkAsReadApi = async (book: Book): Promise<void> => {
  try {
    const res = await fetchApi(`${RANK_URL}/books/user/mark`, {
      method: 'POST',
      body: JSON.stringify(markBook(book)),
    });

    if (!res.ok) throw new ServerError();
  } catch (error) {
    throw error;
  }
};

export const getUserStats = async (): Promise<Stats> => {
  try {
    const [points, trophies] = await Promise.all([
      fetchApi(`${RANK_URL}/users/points`),
      fetchApi(`${RANK_URL}/users/trophies`),
    ]);

    if (!points.ok || !trophies.ok) throw new ServerError();

    const [pointsData, trophiesData] = await Promise.all([points.json(), trophies.json()]);
    return {
      points: pointsData,
      trophies: trophiesData,
    };
  } catch (error) {
    throw error;
  }
};
