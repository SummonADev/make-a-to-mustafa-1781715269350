import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import SignInScreen from '@/components/SignInScreen';
import { useAuth } from '@/hooks/useAuth';

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@unstuck.app',
  name: 'Demo Doer',
  picture: '/images/Passport-Photo.jpg',
  provider: 'demo' as const,
};

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

  // If no Google Client ID is configured, skip the sign-in gate so the preview
  // is still usable. Users can wire up VITE_GOOGLE_CLIENT_ID to enable real auth.
  const effectiveUser = user ?? (!clientId ? DEMO_USER : null);

  if (!effectiveUser) {
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
        <Route path="/" element={<HomePage user={effectiveUser} onSignOut={signOut} />} />
      </Routes>
    </BrowserRouter>
  );
}
