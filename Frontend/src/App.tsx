import React from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return <AuthForm />;
}

export default App;