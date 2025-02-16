
import { Auth } from "@/components/Auth";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <nav className="p-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold text-squid-pink">Squid Game</h1>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Auth />
      </main>
    </div>
  );
};

export default Index;
