
import { useEffect, useRef } from "react";
import { SandpackConsole } from "@codesandbox/sandpack-react";

export default function ConsoleOutput() {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      // Add custom styles to the console
      const style = document.createElement("style");
      style.innerHTML = `
        .sp-console-wrapper {
          height: 100% !important;
          background-color: hsl(var(--editor-background)) !important;
          border: 1px solid hsl(var(--editor-border)) !important;
          border-radius: 0.5rem !important;
        }
        .sp-console {
          background-color: hsl(var(--editor-background)) !important;
        }
        .sp-console-item {
          border-bottom: 1px solid hsl(var(--editor-border)) !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className="h-full" ref={consoleRef}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-editor-border bg-editor-background rounded-t-lg">
        <span className="text-sm font-medium">Console</span>
      </div>
      <div className="h-[calc(100%-40px)]">
        <SandpackConsole resetOnPreviewRestart showHeader={false} />
      </div>
    </div>
  );
}
