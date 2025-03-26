
import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

interface TerminalProps {
  onCommand: (command: string) => void;
}

export default function Terminal({ onCommand }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef(new FitAddon());

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js terminal
    const term = new XTerm({
      cursorBlink: true,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: 'var(--editor-background)',
        foreground: 'var(--editor-foreground)',
        cursor: 'var(--editor-foreground)',
        cursorAccent: 'var(--editor-background)',
        selection: 'rgba(180, 215, 255, 0.3)',
      },
    });

    // Save reference to terminal
    xtermRef.current = term;

    // Add the fit addon
    term.loadAddon(fitAddonRef.current);
    
    // Add web links addon for clickable links
    term.loadAddon(new WebLinksAddon());

    // Open the terminal in the container
    term.open(terminalRef.current);
    
    // Fit terminal to container
    fitAddonRef.current.fit();
    
    // Show welcome message
    term.writeln("\x1B[1;35m# Welcome to the Interactive Terminal\x1B[0m");
    term.writeln("\x1B[1;35m# Type 'help' to see available commands\x1B[0m");
    term.writeln("");
    term.write("$ ");
    
    // Handle user input
    let currentLine = "";
    
    term.onKey(({ key, domEvent }) => {
      const charCode = key.charCodeAt(0);
      
      // Handle enter key
      if (domEvent.key === "Enter") {
        term.writeln("");
        
        if (currentLine.trim()) {
          processCommand(currentLine.trim());
        }
        
        currentLine = "";
        term.write("$ ");
        return;
      }
      
      // Handle backspace key
      if (domEvent.key === "Backspace") {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write("\b \b");
        }
        return;
      }
      
      // Handle printable characters
      if (charCode >= 32 && charCode < 127) {
        currentLine += key;
        term.write(key);
      }
    });
    
    const processCommand = (command: string) => {
      // Handle built-in commands
      if (command === "clear") {
        term.clear();
        return;
      }
      
      if (command === "help") {
        term.writeln("\x1B[1;34mAvailable commands:\x1B[0m");
        term.writeln("  clear             Clear the terminal");
        term.writeln("  help              Show this help message");
        term.writeln("  npm install       Install a package (e.g., npm install lodash)");
        term.writeln("");
        return;
      }
      
      // Pass the command to the parent component
      onCommand(command);
    };

    // Handle window resize events
    const handleResize = () => {
      fitAddonRef.current.fit();
    };
    
    window.addEventListener("resize", handleResize);
    
    // Clean up on unmount
    return () => {
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [onCommand]);

  return (
    <div className="h-full bg-editor-background border border-editor-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-editor-border">
        <span className="text-sm font-medium">Terminal</span>
      </div>
      <div ref={terminalRef} className="h-[calc(100%-40px)]" />
    </div>
  );
}
