import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SignIn } from './sign-in';

import { AuthProvider } from '../providers/auth';

describe('SignIn', () => {
  type renderProps = {
    fetchLoginApi?: jest.Mock<any, any>;
    redirect?: jest.Mock<any, any>;
  };

  const renderSign = ({ fetchLoginApi = jest.fn(), redirect = jest.fn() }: renderProps = {}) => {
    render(
      <AuthProvider fetchLoginApi={fetchLoginApi}>
        <SignIn redirect={redirect} />
      </AuthProvider>
    );
  };

  const changeInputField = (field: RegExp, value: string) => {
    const inputField = screen.getByLabelText(field);

    fireEvent.change(inputField, { target: { value } });
  };

  const submitForm = () => {
    const submitButton = screen.getByText(/login/i);
    fireEvent.click(submitButton);
  };

  it('renders correcty', () => {
    renderSign();
    const titleElement = screen.getByRole('heading', { name: /Esse eu já li/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('should redirect to home when request has success', async () => {
    const fetchLoginApi = jest.fn().mockImplementation(() =>
      Promise.resolve({
        data: { access_token: 'token test' },
        status: 200,
      })
    );
    const redirect = jest.fn();

    renderSign({ fetchLoginApi, redirect });

    changeInputField(/email/i, 'test@test.com');
    changeInputField(/senha/i, '123456');

    submitForm();

    expect(fetchLoginApi).toBeCalledWith('test@test.com', '123456');

    await waitFor(() => {
      expect(redirect).toBeCalledWith('/');
    });
  });

  it('should show a message error when try sign with invalid credentials', async () => {
    const MessageError = 'Email e/ou senha inválidos';
    const fetchLoginApi = jest.fn().mockImplementation(() =>
      Promise.reject({
        status: 401,
        message: MessageError,
      })
    );
    const redirect = jest.fn();

    renderSign({ fetchLoginApi, redirect });

    changeInputField(/email/i, 'wrong@test.com');
    changeInputField(/senha/i, '123456');

    submitForm();

    expect(redirect).not.toBeCalled();

    const errorMessage = await screen.findByText(MessageError);
    expect(errorMessage).toBeInTheDocument();

    expect(redirect).not.toBeCalled();
  });
});
