import { Book } from '../pages/home';
import { AuthResponse } from '../providers/auth';

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
    const res = await fetch('http://localhost:8080/auth', {
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
    const res = await fetch(`http://localhost:8080/books?text=${search}`);

    if (!res.ok) throw new ServerError();

    return await res.json();
  } catch (error) {
    throw error;
  }
};
