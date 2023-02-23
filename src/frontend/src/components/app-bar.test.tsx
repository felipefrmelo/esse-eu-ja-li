import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AppBar } from './app-bar';
import { useAuthContext } from '../providers/auth';

jest.mock('../providers/auth');

const mockUserContext = (params: { user: { name: string } }) => {
  (useAuthContext as jest.Mock).mockImplementation(() => params);
};

function renderAppBar(redirect = jest.fn()) {
  render(<AppBar redirect={redirect} />);
}

describe('AppBar', () => {
  beforeEach(() => {
    mockUserContext({
      user: {
        name: 'testname',
      },
    });
  });

  it('renders correcty', () => {
    renderAppBar();
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

    renderAppBar();

    const username = screen.getByText(name);

    expect(username).toBeInTheDocument();
  });

  it('should redirect to profile page when user click on profile button', async () => {
    const redirect = jest.fn();
    renderAppBar(redirect);

    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    fireEvent.click(profileButton);

    const profileMenuItem = await screen.findByRole('menuitem', { name: /profile/i });
    fireEvent.click(profileMenuItem);

    expect(redirect).toHaveBeenCalledWith('/profile');
  });

  it('should redirect to signin page when user click on login button', async () => {
    const redirect = jest.fn();
    mockUserContext({} as any)
    renderAppBar(redirect);

    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    fireEvent.click(profileButton);

    const signoutMenuItem = await screen.findByRole('menuitem', { name: /login/i });
    fireEvent.click(signoutMenuItem);

    expect(redirect).toHaveBeenCalledWith('/signin');
  });

  it('should not shou login button when user is logged', async () => {
    const redirect = jest.fn();
    renderAppBar(redirect);

    const profileButton = screen.getByRole('button', { name: /account of current user/i });
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.queryByRole('menuitem', { name: /login/i })).not.toBeInTheDocument();
    });
  });
});
