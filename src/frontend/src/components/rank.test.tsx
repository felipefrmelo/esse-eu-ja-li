import { screen, render } from '@testing-library/react';

import { Rank, Ranking } from './rank';

export const getRank = async (): Promise<Rank[]> => {
  return [
    {
      user: {
        id: '4f4eb8d1-98ae-4c6a-8081-ed5400c6d11c',
        name: 'test1',
      },
      points: 300,
    },
    {
      user: {
        id: '7f4eb8d2-95ae-4c6a-8081-ed5400c6d11c',
        name: 'test2',
      },
      points: 220,
    },
    {
      user: {
        id: '5f4eb8d4-98ae-4c6a-8081-ed5400c6d11c',
        name: 'test3',
      },
      points: 100,
    },
  ];
};

export const renderBank = () => {
  render(<Ranking getRank={getRank} />);
};

describe('Rank', () => {
  it('should render successfully', async () => {
    renderBank();
    expect(await screen.findByText('Rank')).toBeInTheDocument();
  });

  it('should render the rank', async () => {
    renderBank();

    expect(await screen.findByText('test1')).toBeInTheDocument();
    expect(await screen.findByText('test2')).toBeInTheDocument();
    expect(await screen.findByText('test3')).toBeInTheDocument();

    expect(await screen.findByText('300')).toBeInTheDocument();
    expect(await screen.findByText('220')).toBeInTheDocument();
    expect(await screen.findByText('100')).toBeInTheDocument();
  });
});
