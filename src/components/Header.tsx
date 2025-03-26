
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Code, Github } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-background/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-medium">LiveCode</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/your-repo/live-code-editor" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="icon" className="rounded-full">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
