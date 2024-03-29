import { EmojiEventsTwoTone } from '@mui/icons-material';
import { CircularProgress, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Rank, Ranking } from '../components/rank';
import { RequireUser } from '../components/require-auth';

type Trophy = {
  category: string;
};

export type Stats = {
  points: number;
  trophies: Trophy[];
};

export interface ProfileProps {
  user: RequireUser;
  getUserStats: () => Promise<Stats>;
  getUserRanking: () => Promise<Rank[]>;
}

const ShowStats = ({ stats }: { stats?: Stats }) => {
  if (!stats) return <CircularProgress />;

  return (
    <Grid container spacing={5} justifyContent="center" maxWidth={500} margin="auto">
      <Grid container spacing={5} item justifyContent="center">
        <Grid item>
          <Typography variant="h4" align="center">
            {stats.points}
          </Typography>
          <Typography variant="subtitle1">Pontos</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h4" align="center">
            {stats.trophies.length}
          </Typography>
          <Typography variant="subtitle1">Troféus</Typography>
        </Grid>
      </Grid>

      <Grid container item xs={12}>
        {stats.trophies.map((trophy) => (
          <Grid
            item
            fontSize={100}
            container
            flexDirection="column"
            alignItems="center"
            xs={6}
            key={trophy.category}
          >
            <EmojiEventsTwoTone fontSize="inherit" sx={{ color: 'goldenrod' }} />
            <Typography variant="subtitle2" align="center">
              Leitor {trophy.category}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export const Profile = ({ user, getUserStats, getUserRanking }: ProfileProps) => {
  const [stats, setStats] = useState<Stats>();

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getUserStats();
      setStats(stats);
    };

    fetchStats();
  }, [getUserStats]);

  return (
    <Grid container spacing={5} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" align="center">
          Parabéns, {user.name}!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ShowStats stats={stats} />
      </Grid>
      <Grid item xs={12}>
        <Ranking getRank={getUserRanking} />
      </Grid>
    </Grid>
  );
};
