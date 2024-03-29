import { render, screen, waitFor } from '@testing-library/react';
import { RequireAuth, RequireUser } from './require-auth';

import { useAuthContext } from '../providers/auth';

jest.mock('../providers/auth');

type Params = {
  user: {
    name: string;
  } | null;
};

const mockUserContext = (params: Params) => {
  (useAuthContext as jest.Mock).mockImplementation(() => params);
};

describe('RequireAuth', () => {
  type renderProps = {
    redirect?: jest.Mock<any, any>;
    component?: React.FC;
    componentProps?: any;
  };

  const renderRequireAuth = ({
    redirect = jest.fn(),
    component = () => <div>Logged</div>,
    componentProps,
  }: renderProps = {}) => {
    render(<RequireAuth redirect={redirect} component={component} {...componentProps} />);
  };

  it('should render the component if user is logged', () => {
    mockUserContext({
      user: {
        name: 'John Doe',
      },
    });

    const redirect = jest.fn();

    renderRequireAuth({ redirect });

    expect(screen.getByText('Logged')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('should redirect if user is not logged', async () => {
    mockUserContext({
      user: null,
    });

    const redirect = jest.fn();

    renderRequireAuth({ redirect });

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/signin');
    });
  });

  it('should component receive user as props', () => {
    mockUserContext({
      user: {
        name: 'John Doe',
      },
    });

    const redirect = jest.fn();
    type ComponentProps = {
      user: RequireUser;
      fooProp: string;
    };

    const Component = (props: ComponentProps) => {
      return (
        <div>
          {props.user?.name} Logged {props.fooProp}
        </div>
      );
    };

    render(
      <RequireAuth
        redirect={redirect}
        component={Component}
        componentProps={{ fooProp: 'today' }}
      />
    );

    expect(screen.getByText('John Doe Logged today')).toBeInTheDocument();
  });
});
