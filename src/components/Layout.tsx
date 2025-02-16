
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-6xl mx-auto">
        {session && (
          <div className="flex items-center justify-center space-x-2 mb-8">
            <DashboardHeader
              onOpenCreateGame={() => {}} // No-op since create game is only for dashboard
              onLogout={handleLogout}
              isCreateGameOpen={false}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
