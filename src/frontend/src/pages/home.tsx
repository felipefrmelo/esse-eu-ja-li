import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Copyright } from '../components/copyright';
import TextField from '@mui/material/TextField';
import { AppBar } from '../components/app-bar';
import { useCallback, useEffect, useState } from 'react';

export interface Book {
  id: string;
  title: string;
  description: string;
  image: string;
}

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
              <BookCard key={book.id} book={book} />
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

const BookCard = ({ book }: { book: Book }) => {
  const maxLengthTitle = 50;
  return (
    <Grid item key={book.id} xs={12} sm={6} md={3}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia component="img" image={book.image} alt={book.title} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2">
            {book.title.length > maxLengthTitle
              ? `${book.title.substring(0, maxLengthTitle)}...`
              : book.title}
          </Typography>
          <Typography noWrap>{book.description}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View</Button>
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
