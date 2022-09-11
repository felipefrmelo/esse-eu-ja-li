import AppBarMui from '@mui/material/AppBar';
import BookIcon from '@mui/icons-material/BookRounded';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../providers/auth';

export const AppBar = () => {
  const { user } = useAuthContext();
  return (
    <AppBarMui position="relative">
      <Toolbar>
        <BookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" color="inherit" noWrap>
          Livros
        </Typography>

        <Typography variant="h6" color="inherit" noWrap>
          {user?.name}
        </Typography>
      </Toolbar>
    </AppBarMui>
  );
};
