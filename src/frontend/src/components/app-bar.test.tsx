import { render, screen } from '@testing-library/react';
import { AppBar } from './app-bar';
import { useAuthContext } from '../providers/auth';

jest.mock('../providers/auth');

const mockUserContext = (params: { user: { name: string } }) => {
  (useAuthContext as jest.Mock).mockImplementation(() => params);
};

describe('AppBar', () => {
  beforeEach(() => {
    mockUserContext({
      user: {
        name: 'testname',
      },
    });
  });

  it('renders correcty', () => {
    render(<AppBar />);
    const titleElement = screen.getByRole('heading', { name: /livros/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('should show a user name when his is logged', () => {
    const name = 'test';
    mockUserContext({
      user: {
        name,
      },
    });

    render(<AppBar />);

    const username = screen.getByText(name);

    expect(username).toBeInTheDocument();
  });
});
