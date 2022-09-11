import { render, screen } from '@testing-library/react';
import { Home } from './home';

describe('SignIn', () => {
  it('renders correcty', () => {
    render(<Home />);
    const titleElement = screen.getByRole('heading', { name: /home/i });
    expect(titleElement).toBeInTheDocument();
  });
});
