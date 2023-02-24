import { useEffect } from 'react';
import { useAuthContext, User } from '../providers/auth';

export type RequireUser = Omit<User, 'access_token'>;

interface K {
  user: RequireUser;
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

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        redirect('/signin');
      }, 0);
      return;
    }
  }, [redirect, user]);

  if (user) {
    return <Component {...componentProps} user={user} />;
  }
  return null;
};
