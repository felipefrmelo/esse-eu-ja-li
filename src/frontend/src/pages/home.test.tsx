import { fireEvent, render, screen } from '@testing-library/react';
import { createRandomBook } from '../domain/book.test';
import { Home } from './home';


const makeBooks = () => [
      createRandomBook({
        id: '1',
        title: 'Aprendendo React',
        description: 'Livro sobre React',
        image:
          'https://images-na.ssl-images-amazon.com/images/I/51Zyv9Z8QWL._SX379_BO1,204,203,200_.jpg',
      }),
      createRandomBook({
        id: '2',
        title: 'Aprendendo React Native',
        description: 'Livro sobre React Native',
        image: 'https://m.media-amazon.com/images/I/51Zyv9Z8QWL.jpg',
      }),
    ]

describe('Home', () => {
  it('should fetch books from api', async () => {
    const books = makeBooks();

    const fetchBooks = jest.fn().mockResolvedValue(books);

    render(<Home fetchBooks={fetchBooks} />);

    expect(fetchBooks).toHaveBeenCalled();

    const book = await screen.findByText(/Aprendendo React$/i);
    expect(book).toBeInTheDocument();

    const book2 = await screen.findByText(/Aprendendo React Native/i);
    expect(book2).toBeInTheDocument();
  });

  it('should fetch books from api with search', async () => {
    const books = makeBooks();

    const fetchBooks = jest.fn().mockResolvedValue(books);

    render(<Home fetchBooks={fetchBooks} />);

    const search = screen.getByLabelText(/buscar livros/i);
    fireEvent.change(search, { target: { value: 'React' } });

    const button = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(button);

    expect(fetchBooks).toHaveBeenNthCalledWith(2, 'React');

    const book = await screen.findByText(/Aprendendo React$/i);
    expect(book).toBeInTheDocument();

    const book2 = await screen.findByText(/Aprendendo React Native/i);
    expect(book2).toBeInTheDocument();
  });
});
