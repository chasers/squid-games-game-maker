
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { signOut, session } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-6xl mx-auto">
        {session && (
          <DashboardHeader
            onOpenCreateGame={() => {}} // No-op since create game is only for dashboard
            onLogout={handleLogout}
            isCreateGameOpen={false}
          />
        )}
        {children}
      </div>
    </div>
  );
};
