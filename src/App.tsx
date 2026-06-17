import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import SignInScreen from '@/components/SignInScreen';
import { useAuth } from '@/hooks/useAuth';

export default function App() {
  const { user, ready, scriptLoaded, clientId, renderButton, signOut } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-sm font-bold text-[#1a1530]/60 dark:text-[#f1ecff]/60">
          Loading…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <SignInScreen
        clientId={clientId}
        scriptLoaded={scriptLoaded}
        renderButton={renderButton}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage user={user} onSignOut={signOut} />} />
      </Routes>
    </BrowserRouter>
  );
}
