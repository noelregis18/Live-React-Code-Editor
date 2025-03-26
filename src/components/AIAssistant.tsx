
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";

interface AIAssistantProps {
  onApplyCode: (code: string) => void;
}

export default function AIAssistant({ onApplyCode }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const generateCode = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponse("");
    
    try {
      // In a real implementation, this would be a call to the Gemini API
      // For demo purposes, we'll fake a response after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a fake response based on the prompt
      const demoResponse = generateDemoResponse(prompt);
      setResponse(demoResponse);
    } catch (error) {
      console.error("Error generating code:", error);
      setResponse("An error occurred while generating code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate a demo response based on the prompt
  const generateDemoResponse = (prompt: string) => {
    if (prompt.toLowerCase().includes("button")) {
      return `
// Here's a styled button component:
import React from 'react';

export default function StyledButton({ children, onClick, color = 'blue' }) {
  const colors = {
    blue: { bg: '#0074CC', hover: '#005999' },
    green: { bg: '#00B57D', hover: '#009965' },
    red: { bg: '#E02F2F', hover: '#BA2525' },
  };
  
  const style = {
    backgroundColor: colors[color]?.bg || colors.blue.bg,
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  };
  
  return (
    <button 
      onClick={onClick}
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = colors[color]?.hover || colors.blue.hover;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = colors[color]?.bg || colors.blue.bg;
      }}
    >
      {children}
    </button>
  );
}
`;
    } else if (prompt.toLowerCase().includes("counter")) {
      return `
// Here's a counter component with increment and decrement:
import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '0.5rem',
      backgroundColor: '#f5f5f5'
    }}>
      <h2 style={{ fontSize: '2rem', margin: 0 }}>{count}</h2>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={decrement}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#E02F2F',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
        <button
          onClick={increment}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#00B57D',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
`;
    } else {
      return `
// Here's a basic React component based on your prompt:
import React from 'react';

export default function GeneratedComponent() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    }}>
      <h2 style={{ marginTop: 0 }}>Generated Component</h2>
      <p>This is a component generated based on your prompt:</p>
      <blockquote style={{ 
        padding: '1rem',
        borderLeft: '4px solid #0074CC',
        backgroundColor: 'white',
        margin: '1rem 0'
      }}>
        "${prompt}"
      </blockquote>
      <p>Try editing this component to better match your needs!</p>
    </div>
  );
}
`;
    }
  };

  const handleApplyCode = () => {
    if (response) {
      onApplyCode(response);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-editor-border bg-editor-background rounded-t-lg">
        <span className="text-sm font-medium">AI Assistant</span>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 bg-editor-background border border-editor-border rounded-b-lg overflow-hidden">
        <Textarea 
          placeholder="Describe the code you want to generate (e.g., 'Create a button component with hover effects')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 min-h-[100px] resize-none"
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setPrompt("")}
            disabled={!prompt || loading}
          >
            Clear
          </Button>
          <Button
            onClick={generateCode}
            disabled={!prompt.trim() || loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Code
              </>
            )}
          </Button>
        </div>
        
        {response && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Generated Code</h3>
              <Button variant="ghost" size="sm" onClick={handleApplyCode}>
                Apply Code
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm h-[200px]">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
