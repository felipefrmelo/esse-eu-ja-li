import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export const Copyright = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link
        color="inherit"
        target="_blank"
        href="https://github.com/users/felipefrmelo/projects/10"
      >
        Esse eu já li
      </Link>{' '}
      {new Date().getFullYear()} &hearts;
    </Typography>
  );
};
