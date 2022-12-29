import { render, screen, fireEvent } from '@testing-library/react';
import { createRandomBook } from '../domain/book.test';
import { BookCard } from './book-card';

describe('BookCard', () => {
  it('should render successfully', () => {
    const randomBook = createRandomBook();
    render(<BookCard book={randomBook} />);
    expect(screen.getByText(randomBook.title)).toBeInTheDocument();
    expect(screen.getByText(randomBook.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', randomBook.image);
  });

  it('should render a button "Detalhes"', () => {
    const randomBook = createRandomBook();
    render(<BookCard book={randomBook} />);
    expect(screen.getByRole('button', { name: 'Detalhes' })).toBeInTheDocument();
  })

  it('should render a modal with book details', () => {
    const randomBook = createRandomBook();
    render(<BookCard book={randomBook} />);

    const button = screen.getByRole('button', { name: 'Detalhes' });

    expect(screen.queryByText(randomBook.publisher)).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.published_date)).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.pages.toString())).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.authors[0])).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.authors[1])).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getAllByText(randomBook.title)).toHaveLength(2);
    expect(screen.getAllByText(randomBook.description)).toHaveLength(2);;
    expect(screen.getByRole('img')).toHaveAttribute('src', randomBook.image);
    expect(screen.getByText(randomBook.publisher)).toBeInTheDocument();
    expect(screen.getByText(randomBook.published_date)).toBeInTheDocument();
    expect(screen.getByText(randomBook.pages.toString())).toBeInTheDocument();
    randomBook.authors.forEach(author => {
        expect(screen.getByText(author)).toBeInTheDocument();
    });
    randomBook.categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  })
});
