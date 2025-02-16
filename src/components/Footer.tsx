
import { Code2, Database } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
      <div className="container flex justify-center items-center text-sm text-muted-foreground">
        Built with{" "}
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mx-1 hover:text-primary transition-colors"
        >
          <Code2 className="h-4 w-4 mr-1" />
          Lovable
        </a>{" "}
        and{" "}
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mx-1 hover:text-primary transition-colors"
        >
          <Database className="h-4 w-4 mr-1" />
          Supabase
        </a>
      </div>
    </footer>
  );
};
