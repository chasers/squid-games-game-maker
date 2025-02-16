
import { Code2, Database } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
      <div className="container flex justify-center items-center text-sm text-muted-foreground">
        Built with{" "}
        <span className="inline-flex items-center mx-1">
          <Code2 className="h-4 w-4 mr-1" />
          Lovable
        </span>{" "}
        and{" "}
        <span className="inline-flex items-center mx-1">
          <Database className="h-4 w-4 mr-1" />
          Supabase
        </span>
      </div>
    </footer>
  );
};
