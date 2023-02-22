import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
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
}

const ShowStats = ({ stats }: { stats?: Stats }) => {
  if (!stats) return <CircularProgress />;

  return (
    <>
      {<p>{stats.points}</p>}
      {stats.trophies.map((t) => (
        <p key={t.category}>{t.category}</p>
      ))}
    </>
  );
};

export const Profile = ({ user, getUserStats }: ProfileProps) => {
  const [stats, setStats] = useState<Stats>();

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getUserStats();
      setStats(stats);
    };

    fetchStats();
  }, [getUserStats]);

  return (
    <div>
      <h1>Profile</h1>
      <p>{user.name}</p>

      <ShowStats stats={stats} />
    </div>
  );
};
