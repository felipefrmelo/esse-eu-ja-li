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
import { useState } from 'react';
import { Book } from '../domain/book';

const DetailsModal = ({ book }: { book: Book }) => {
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export const BookCard = ({ book }: { book: Book }) => {
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
          <DetailsModal book={book} />
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
