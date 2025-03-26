
import { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

export type FileStructure = {
  [key: string]: {
    code: string;
    active?: boolean;
  };
};

export const INITIAL_REACT_FILE = `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Hello, React!</h1>
      <p>This is a live React editor. Try making changes!</p>
      <button 
        onClick={increment}
        style={{
          backgroundColor: '#0074CC',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Count: {count}
      </button>
    </div>
  );
}
`;

export const DEFAULT_FILES: FileStructure = {
  "/App.js": {
    code: INITIAL_REACT_FILE,
    active: true,
  },
  "/index.js": {
    code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  },
  "/package.json": {
    code: `{
  "name": "react-live-editor",
  "version": "1.0.0",
  "description": "A live React code editor",
  "main": "index.js",
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-scripts": "5.0.1"
  }
}`,
  },
};

export const SANDPACK_TEMPLATE: SandpackPredefinedTemplate = "react";

// Helper to add a new file to the existing files
export const addNewFile = (
  files: FileStructure,
  fileName: string,
  code: string = ""
): FileStructure => {
  return {
    ...files,
    [fileName]: {
      code,
      active: true,
    },
  };
};

// Helper to delete a file from the existing files
export const deleteFile = (
  files: FileStructure,
  fileName: string
): FileStructure => {
  const newFiles = { ...files };
  delete newFiles[fileName];
  return newFiles;
};

// Helper to rename a file in the existing files
export const renameFile = (
  files: FileStructure,
  oldFileName: string,
  newFileName: string
): FileStructure => {
  const newFiles = { ...files };
  const fileContent = newFiles[oldFileName];
  delete newFiles[oldFileName];
  newFiles[newFileName] = fileContent;
  return newFiles;
};

// Helper to add a new dependency to package.json
export const addDependency = (
  files: FileStructure,
  packageName: string,
  version: string = "latest"
): FileStructure => {
  const packageJson = JSON.parse(files["/package.json"].code);
  packageJson.dependencies = {
    ...packageJson.dependencies,
    [packageName]: version,
  };

  return {
    ...files,
    "/package.json": {
      ...files["/package.json"],
      code: JSON.stringify(packageJson, null, 2),
    },
  };
};
