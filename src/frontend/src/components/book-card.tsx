import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Book } from '../domain/book';

export interface BookCardProps {
  book: Book;
  handleMarkAsRead: (book: Book) => Promise<void>;
  getUserBookById: (bookId: string) => Promise<Book>;
}

const useHandleMarkAsRead = ({ book, handleMarkAsRead, getUserBookById }: BookCardProps) => {
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const getUserBook = async () => {
      try {
        await getUserBookById(book.id);
        setIsRead(true);
      } catch (e) {
        setIsRead(false);
      }
    };
    getUserBook();
  }, [book, getUserBookById]);

  const handleMarkAsReadClick = async () => {
    try {
      await handleMarkAsRead(book);
      setIsRead(true);
    } catch (error) {
      setIsRead(false);
    }
  };

  return { isRead, handleMarkAsReadClick };
};

interface BookDetailsProps {
  book: Book;
  isRead: boolean;
  handleMarkAsReadClick: () => Promise<void>;
}

const DetailsModal = ({ book, isRead, handleMarkAsReadClick }: BookDetailsProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button size="small" color="primary" onClick={handleOpen}>
        Detalhes
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{book.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{book.description}</DialogContentText>
          <CardMedia component="img" height="140" image={book.image} alt={book.title} />
          <Typography gutterBottom variant="h6" component="div">
            Editora
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {book.publisher}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Data de publicação
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {book.published_date}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Número de páginas
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {book.pages}
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            Categorias
          </Typography>
          <Stack direction="row" spacing={1}>
            {book.categories.map((category) => (
              <Chip key={category} label={category} color="primary" variant="outlined" />
            ))}
          </Stack>
          <Typography gutterBottom variant="h6" component="div">
            Autores
          </Typography>
          <Stack direction="row" spacing={1}>
            {book.authors.map((author) => (
              <Chip key={author} label={author} color="primary" variant="outlined" />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
          <Button onClick={handleMarkAsReadClick}>{isRead ? 'Já li' : 'Marcar como lido'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const BookCard = ({ book, handleMarkAsRead, getUserBookById }: BookCardProps) => {
  const maxLengthTitle = 50;

  const { isRead, handleMarkAsReadClick } = useHandleMarkAsRead({
    book,
    handleMarkAsRead,
    getUserBookById,
  });
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
          <DetailsModal book={book} isRead={isRead} handleMarkAsReadClick={handleMarkAsReadClick} />
        </CardActions>
      </Card>
    </Grid>
  );
};
