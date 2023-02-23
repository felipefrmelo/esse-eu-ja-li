import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { AppBar } from './app-bar';

interface LayoutProps {
  redirect: (s: string) => void;
}

export const Layout = ({ redirect }: LayoutProps) => (
  <Box minHeight={'100vh'} display={'flex'} flexDirection={'column'}>
    <AppBar redirect={redirect} />
    <Outlet />
  </Box>
);
