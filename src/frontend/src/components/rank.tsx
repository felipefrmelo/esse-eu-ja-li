import { MilitaryTech } from '@mui/icons-material';
import {
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type Rank = {
  user: {
    id: string;
    name: string;
  };
  points: number;
};

export interface RankProps {
  getRank: () => Promise<Rank[]>;
}

export const Ranking = ({ getRank }: RankProps) => {
  const [rank, setRank] = useState<Rank[]>([]);

  useEffect(() => {
    const getRanking = async () => {
      const rank = await getRank();
      setRank(rank);
    };
    getRanking();
  }, [getRank]);

  return (
    <Grid p={2} maxWidth={500} margin="auto">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Rank
      </Typography>
      <List>
        <ListItem divider>
          <ListItemButton>
            <ListItemIcon>
              <MilitaryTech fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary="Nome"
              secondary="pontos"
              primaryTypographyProps={{ variant: 'h6' }}
            />
          </ListItemButton>
        </ListItem>
        {rank.map((item, position) => (
          <ListItem key={item.user.id} divider>
            <ListItemButton>
              <ListItemIcon>
                <Avatar sx={{ width: 28, height: 28, fontSize: 20, bgcolor: 'primary.main' }}>
                  {position + 1}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={item.user.name} secondary={item.points} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};
