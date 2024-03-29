import { SignIn } from './pages/sign-in';
import { AuthProvider } from './providers/auth';
import { fetchBooksApi, fetchLoginApi, getUserRanking, getUserStats } from './services/api';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';
import { RequireAuth } from './components/require-auth';
import { Profile } from './pages/profile';
import { Layout } from './components/layout';

function App() {
  const navigate = useNavigate();
  const redirect = (s: string) => {
    navigate(s);
  };
  return (
    <div className="App">
      <AuthProvider fetchLoginApi={fetchLoginApi}>
        <Routes>
          <Route path="signin" element={<SignIn redirect={redirect} />} />
          <Route element={<Layout redirect={redirect} />}>
            <Route path="/" element={<Home fetchBooks={fetchBooksApi} />} />
            <Route
              path="profile"
              element={
                <RequireAuth
                  component={Profile}
                  redirect={redirect}
                  componentProps={{ getUserStats, getUserRanking }}
                />
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
