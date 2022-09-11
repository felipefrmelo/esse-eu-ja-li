import { SignIn } from './pages/sign-in';
import { AuthProvider } from './providers/auth';
import { fetchLoginApi } from './services/api';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './pages/home';

function App() {
  const navigate = useNavigate();
  const redirect = (s: string) => {
    navigate(s);
  };
  return (
    <div className="App">
      <AuthProvider fetchLoginApi={fetchLoginApi}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signin" element={<SignIn redirect={redirect} />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
