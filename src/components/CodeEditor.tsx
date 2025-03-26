
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Terminal from "./Terminal";
import FileExplorer from "./FileExplorer";
import ConsoleOutput from "./ConsoleOutput";
import AIAssistant from "./AIAssistant";
import {
  DEFAULT_FILES,
  SANDPACK_TEMPLATE,
  addNewFile,
  deleteFile,
  renameFile,
  addDependency,
} from "@/utils/sandpackUtils";

export default function CodeEditor() {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [currentView, setCurrentView] = useState<"preview" | "console">("preview");

  const handleTerminalCommand = (command: string) => {
    // Parse npm install commands
    if (command.startsWith("npm install") || command.startsWith("npm i")) {
      const parts = command.split(" ");
      if (parts.length > 2) {
        const packageName = parts[2];
        // Ignore version specifiers for simplicity
        const cleanPackageName = packageName.split("@")[0];
        handleAddDependency(cleanPackageName);
      }
    }
  };

  const handleAddDependency = (packageName: string) => {
    setFiles((prev) => addDependency(prev, packageName));
  };

  const handleFileSelect = (fileName: string) => {
    setActiveFile(fileName);
  };

  const handleAddFile = (fileName: string, content: string = "") => {
    setFiles((prev) => addNewFile(prev, fileName, content));
    setActiveFile(fileName);
  };

  const handleDeleteFile = (fileName: string) => {
    // Don't allow deletion of index.js or package.json
    if (fileName === "/index.js" || fileName === "/package.json") return;
    
    setFiles((prev) => deleteFile(prev, fileName));
    if (activeFile === fileName) {
      setActiveFile("/App.js");
    }
  };

  const handleRenameFile = (oldFileName: string, newFileName: string) => {
    setFiles((prev) => renameFile(prev, oldFileName, newFileName));
    if (activeFile === oldFileName) {
      setActiveFile(newFileName);
    }
  };

  const handleApplyGeneratedCode = (code: string) => {
    // Create a new file with the generated code
    const timestamp = new Date().getTime();
    const newFileName = `/GeneratedComponent_${timestamp}.js`;
    handleAddFile(newFileName, code);
  };

  // Create a custom theme that adapts to light/dark mode
  const sandpackTheme = {
    ...atomDark,
    colors: {
      ...atomDark.colors,
      surface1: "var(--editor-background)",
      surface2: "var(--editor-background)",
      surface3: "var(--editor-border)",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SandpackProvider
        template={SANDPACK_TEMPLATE}
        files={files}
        theme={sandpackTheme}
        options={{
          activeFile,
          visibleFiles: Object.keys(files),
        }}
      >
        <SandpackFileUpdater />
        <div className="grid grid-cols-12 gap-4 flex-1 p-4">
          <div className="col-span-3 bg-card rounded-lg border border-border overflow-hidden">
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onRenameFile={handleRenameFile}
            />
          </div>

          <div className="col-span-5 flex flex-col">
            <div className="flex-1 min-h-0">
              <SandpackCodeEditor
                showLineNumbers={true}
                showInlineErrors={true}
                wrapContent={true}
                className="h-full rounded-lg border border-border overflow-hidden"
              />
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-4">
            <Tabs
              defaultValue="preview"
              className="flex-1"
              onValueChange={(value) => setCurrentView(value as "preview" | "console")}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="console">Console</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="h-[calc(100%-40px)]">
                <SandpackPreview
                  showNavigator={true}
                  showRefreshButton={true}
                  className="h-full border border-border rounded-lg overflow-hidden"
                />
              </TabsContent>
              <TabsContent value="console" className="h-[calc(100%-40px)]">
                <ConsoleOutput />
              </TabsContent>
            </Tabs>

            <div className="h-[300px]">
              {currentView === "preview" ? (
                <Terminal onCommand={handleTerminalCommand} />
              ) : (
                <AIAssistant onApplyCode={handleApplyGeneratedCode} />
              )}
            </div>
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}

// Helper component to sync files with SandpackProvider
function SandpackFileUpdater() {
  const { sandpack } = useSandpack();
  
  useEffect(() => {
    // This helps sandpack to refresh when files change
    sandpack.updateFile(sandpack.activeFile, sandpack.files[sandpack.activeFile]?.code || "");
  }, [sandpack.files, sandpack.activeFile]);
  
  return null;
}
