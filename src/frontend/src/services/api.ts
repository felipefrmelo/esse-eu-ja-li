import { Book } from '../domain/book';
import { AuthResponse } from '../providers/auth';

const API_URL = `http://${process.env.REACT_APP_HOST}/api`;

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

export const fetchLoginApi = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw res.status >= 500 ? new ServerError() : new AuthError();

    return {
      data: await res.json(),
      status: res.status,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchBooksApi = async (search: string): Promise<Book[]> => {
    try {
        const res = await fetch(`${API_URL}/books?text=${search}`);

    if (!res.ok) throw new ServerError();

    return await res.json();
  } catch (error) {
    throw error;
  }
};
