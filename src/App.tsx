
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import GameManagement from "@/pages/GameManagement";
import NotFound from "@/pages/NotFound";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/game/:gameId"
          element={
            <ProtectedRoute>
              <GameManagement />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
};

export default App;
