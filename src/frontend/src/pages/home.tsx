import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Copyright } from '../components/copyright';
import TextField from '@mui/material/TextField';
import { AppBar } from '../components/app-bar';
import { useCallback, useEffect, useState } from 'react';
import { BookCard } from '../components/book-card';
import { Book } from '../domain/book';
import { getUserBookByIdApi, handleMarkAsReadApi } from '../services/api';

interface HomeProps {
  fetchBooks: (search: string) => Promise<Book[]>;
}

export const Home = ({ fetchBooks }: HomeProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');

  const handleSearch = useCallback(
    async (q = '') => {
      const books = await fetchBooks(q);
      setBooks(books);
    },
    [fetchBooks]
  );

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(search);
  };

  return (
    <Box minHeight={'100vh'} display={'flex'} flexDirection={'column'}>
      <AppBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
          }}
        >
          <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
              <TextField
                placeholder="Mais vendidos"
                fullWidth
                id="search"
                label="Buscar livros"
                variant="outlined"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="end">
                <Button type="submit" variant="contained">
                  Buscar
                </Button>
              </Stack>
            </form>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handleMarkAsRead={handleMarkAsReadApi}
                getUserBookById={getUserBookByIdApi}
              />
            ))}
          </Grid>
        </Container>
      </Box>
      <Box sx={{ bgcolor: 'background.paper', p: 2, position: 'relative' }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Copyright />
      </Box>
    </Box>
  );
};
