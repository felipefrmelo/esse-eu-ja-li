import { render, screen } from '@testing-library/react';
import { Home } from './home';

describe('Home', () => {
  it('should render a input to search books', () => {
    render(<Home />);
    const search = screen.getByLabelText(/buscar livros/i);
    expect(search).toBeInTheDocument();
  });
});
