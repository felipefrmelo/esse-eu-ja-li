import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createRandomBook } from '../domain/book.test';
import { BookCard, BookCardProps } from './book-card';

const openModal = () => fireEvent.click(screen.getByRole('button', { name: 'Detalhes' }));

function renderBookCard({
  book = createRandomBook(),
  handleMarkAsRead = jest.fn(),
  getUserBookById = jest.fn().mockRejectedValue(new Error('Book not found')),
}: Partial<BookCardProps> = {}) {
  render(
    <BookCard book={book} handleMarkAsRead={handleMarkAsRead} getUserBookById={getUserBookById} />
  );
}

describe('BookCard', () => {
  it('should render successfully', async () => {
    const randomBook = createRandomBook();
    renderBookCard({ book: randomBook });
    expect(await screen.findByText(randomBook.title)).toBeInTheDocument();
    expect(screen.getByText(randomBook.description)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', randomBook.image);
  });

  it('should render a modal with book details', async () => {
    const randomBook = createRandomBook();
    renderBookCard({ book: randomBook });

    expect(screen.queryByText(randomBook.publisher)).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.published_date)).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.pages.toString())).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.authors[0])).not.toBeInTheDocument();
    expect(screen.queryByText(randomBook.authors[1])).not.toBeInTheDocument();

    openModal();

    expect(screen.getAllByText(randomBook.title)).toHaveLength(2);
    expect(screen.getAllByText(randomBook.description)).toHaveLength(2);
    expect(screen.getByRole('img')).toHaveAttribute('src', randomBook.image);
    expect(screen.getByText(randomBook.publisher)).toBeInTheDocument();
    expect(screen.getByText(randomBook.published_date)).toBeInTheDocument();
    expect(screen.getByText(randomBook.pages.toString())).toBeInTheDocument();

    await waitFor(() => {
      randomBook.authors.forEach((author) => {
        expect(screen.getByText(author)).toBeInTheDocument();
      });
      randomBook.categories.forEach((category) => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });
  });

  it('should show a button "Já li" when open modal', async () => {
    renderBookCard();

    expect(screen.queryByText('Marcar como lido')).not.toBeInTheDocument();

    openModal();

    expect(await screen.findByText('Marcar como lido')).toBeInTheDocument();
  });

  it('should mark book as read when click on "Marcar como lido"', async () => {
    renderBookCard();

    openModal();

    const readButton = await screen.findByText(/Marcar como lido/i);

    fireEvent.click(readButton);

    await waitFor(() => {
      expect(readButton).toHaveTextContent('Já li');
    });
  });

  it('should not mark book as  read when fail to mark as read', async () => {
    const handleMarkAsRead = jest.fn().mockRejectedValueOnce(new Error('Error'));
    renderBookCard({ handleMarkAsRead });

    openModal();

    const readButton = await screen.findByText(/Marcar como lido/i);

    fireEvent.click(readButton);

    await waitFor(async () => {
      expect(readButton).toHaveTextContent('Marcar como lido');
    });
  });

  it('should show a button "Já li" when book is read', async () => {
    const book = createRandomBook();
    const getUserBookById = jest.fn().mockResolvedValueOnce(book);
    renderBookCard({ book, getUserBookById });

    openModal();

    expect(getUserBookById).toHaveBeenCalledWith(book.id);
    expect(await screen.findByText('Já li')).toBeInTheDocument();
  });
});
