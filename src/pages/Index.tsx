
import CodeEditor from "@/components/CodeEditor";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <CodeEditor />
      </main>
    </div>
  );
};

export default Index;
