import { render, screen } from '@testing-library/react';
import { Profile, ProfileProps } from './profile';

const renderProfile = ({
  getUserStats = jest.fn(),
  getUserRanking = jest.fn().mockResolvedValue([]),
  user = { name: 'John Doe' },
}: Partial<ProfileProps> = {}) => {
  render(<Profile user={user} getUserStats={getUserStats} getUserRanking={getUserRanking} />);
};

describe('Profile', () => {
  it('should render user points', async () => {
    const getUserStats = jest.fn().mockResolvedValue({ points: 1, trophies: [] });

    renderProfile({ getUserStats });

    expect(getUserStats).toHaveBeenCalled();

    expect(await screen.findByText('1')).toBeInTheDocument();
  });

  it('should render user trophies', async () => {
    const getUserStats = jest
      .fn()
      .mockResolvedValue({ points: 0, trophies: [{ category: 'Fiction' }] });

    renderProfile({ getUserStats });

    expect(getUserStats).toHaveBeenCalled();

    expect(await screen.findByText('Leitor Fiction')).toBeInTheDocument();
  });

  it('should render a loading message', async () => {
    const getUserStats = jest.fn();
    const getUserRanking = jest.fn();

    renderProfile({ getUserStats, getUserRanking });

    expect(getUserStats).toHaveBeenCalled();
    expect(getUserRanking).toHaveBeenCalled();

    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
  });
});
