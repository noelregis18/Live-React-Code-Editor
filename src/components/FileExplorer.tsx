
import { useState } from "react";
import { FileStructure } from "@/utils/sandpackUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, FilePlus, FolderPlus, File, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileExplorerProps {
  files: FileStructure;
  activeFile: string;
  onFileSelect: (fileName: string) => void;
  onAddFile: (fileName: string, content: string) => void;
  onDeleteFile: (fileName: string) => void;
  onRenameFile: (oldFileName: string, newFileName: string) => void;
}

export default function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onAddFile,
  onDeleteFile,
  onRenameFile,
}: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [fileToRename, setFileToRename] = useState("");
  const [newName, setNewName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);

  const handleAddFile = () => {
    if (newFileName) {
      const fileName = newFileName.startsWith("/") ? newFileName : `/${newFileName}`;
      onAddFile(fileName, newFileContent);
      setNewFileName("");
      setNewFileContent("");
      setShowAddDialog(false);
    }
  };

  const handleRenameFile = () => {
    if (fileToRename && newName) {
      const newFileName = newName.startsWith("/") ? newName : `/${newName}`;
      onRenameFile(fileToRename, newFileName);
      setFileToRename("");
      setNewName("");
      setShowRenameDialog(false);
    }
  };

  const fileNames = Object.keys(files).sort((a, b) => {
    // Sort package.json last
    if (a === "/package.json") return 1;
    if (b === "/package.json") return -1;
    
    // Sort folders first
    const aIsFolder = a.split("/").length > 2;
    const bIsFolder = b.split("/").length > 2;
    
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    
    // Alphabetical sort
    return a.localeCompare(b);
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Files</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add file</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  New File
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New File</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="fileName" className="text-sm font-medium">
                      File Name
                    </label>
                    <Input
                      id="fileName"
                      placeholder="example.js"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="fileContent" className="text-sm font-medium">
                      Content (optional)
                    </label>
                    <textarea
                      id="fileContent"
                      placeholder="// Your code here"
                      value={newFileContent}
                      onChange={(e) => setNewFileContent(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <Button onClick={handleAddFile}>Create File</Button>
              </DialogContent>
            </Dialog>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </DropdownMenuItem>
              </DialogTrigger>
              {/* Same dialog as above, but with folder-specific placeholder */}
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1">
        {fileNames.map((fileName) => {
          const isActive = fileName === activeFile;
          const depth = fileName.split("/").filter(Boolean).length - 1;
          const displayName = fileName.split("/").pop();

          return (
            <div
              key={fileName}
              className={`flex items-center justify-between group rounded-md text-sm transition-all-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              }`}
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <button
                className="flex items-center py-1.5 px-2 w-full text-left"
                onClick={() => onFileSelect(fileName)}
              >
                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{displayName}</span>
              </button>

              {fileName !== "/package.json" && (
                <div className="flex opacity-0 group-hover:opacity-100 transition-all-200">
                  <Dialog open={showRenameDialog && fileToRename === fileName} 
                          onOpenChange={(open) => {
                            setShowRenameDialog(open);
                            if (open) setFileToRename(fileName);
                            else setFileToRename("");
                          }}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 mr-1">
                        <Edit2 className="h-3 w-3" />
                        <span className="sr-only">Rename</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rename File</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="newName" className="text-sm font-medium">
                            New Name
                          </label>
                          <Input
                            id="newName"
                            placeholder={displayName}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleRenameFile}>Rename</Button>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onDeleteFile(fileName)}
                  >
                    <Trash className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
