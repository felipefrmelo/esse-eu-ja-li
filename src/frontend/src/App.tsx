import { SignIn } from './pages/sign-in';
import { AuthProvider } from './providers/auth';
import { fetchLoginApi } from './services/api';

function App() {
  const redirect = (s: string) => {
    console.log(`redirect to ${s}`);
  };
  return (
    <div className="App">
      <AuthProvider fetchLoginApi={fetchLoginApi}>
        <SignIn redirect={redirect} />
      </AuthProvider>
    </div>
  );
}

export default App;
