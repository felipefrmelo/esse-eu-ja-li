import { useAuthContext, User } from '../providers/auth';

interface K {
  user: User;
}

interface RequireAuthProps<T> {
  component: React.FC<T & K>;
  redirect: (path: string) => void;
  componentProps?: T;
}

export const RequireAuth = <T,>({
  component: Component,
  redirect,
  componentProps = {} as T,
}: RequireAuthProps<T>) => {
  const { user } = useAuthContext();

  if (user) {
    return <Component  {...componentProps} user={user} />;
  }

  redirect('/signin');
  return null;
};
