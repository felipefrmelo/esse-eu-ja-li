import { render, screen } from '@testing-library/react';
import { SignIn } from './sign-in';

test('renders learn react link', () => {
  render(<SignIn />);
  const titleElement = screen.getByRole('heading', { name: /Esse eu já li/i });
  expect(titleElement).toBeInTheDocument();
});
