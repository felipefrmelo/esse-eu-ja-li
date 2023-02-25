import AppBarMui from '@mui/material/AppBar';
import BookIcon from '@mui/icons-material/BookRounded';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAuthContext } from '../providers/auth';
import { useState } from 'react';
import { AccountCircle } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

interface AppBarProps {
  redirect: (s: string) => void;
}

export const AppBar = ({ redirect }: AppBarProps) => {
  const { user } = useAuthContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path: string) => {
    setAnchorEl(null);
    redirect(path);
  };
  return (
    <AppBarMui position="relative">
      <Toolbar>
        <BookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Livros
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" color="inherit" noWrap>
            {user?.name}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleClose('/profile')}>Meus pontos</MenuItem>
            {!user && <MenuItem onClick={() => handleClose('/signin')}>Login</MenuItem>}
          </Menu>
        </Box>
      </Toolbar>
    </AppBarMui>
  );
};
