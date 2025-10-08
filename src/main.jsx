import React, { ViewTransition } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./debugger.css";

import Home from "@/app/Home";
import Login from "@/app/Login";
import { Router, useRouter } from "@/router/index.jsx";
import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";
function Layout({ children }) {
  return (
    <>
      <a
        href="https://github.com/rickhanlonii/async-react"
        target="_blank"
        className="absolute top-4 right-4 hidden md:block"
      >
        <Github />
      </a>
      <div className="root flex-1 w-[475px] h-full overflow-hidden">
        <Card className="h-[610px] gap-2 flex flex-col border-solid border rounded-lg">
          <CardContent className="h-full px-0">
            <div className="flex flex-1 flex-col h-full">
              <div className="flex flex-col flex-1 gap-2 h-full">
                {children}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function AppRouter() {
  const { url } = useRouter();

  return (
    <>
      {url === "/" && (
        <ViewTransition key={url} default="none" enter="auto" exit="auto">
          <Layout heading={<div>Course Lessons</div>}>
            <Home />
          </Layout>
        </ViewTransition>
      )}
      {url === "/login" && (
        <ViewTransition key={url} default="none" enter="auto" exit="auto">
          <Layout>
            <div className="flex flex-col gap-6 p-12">
              <Card className="border-none">
                <Login />
              </Card>
            </div>
          </Layout>
        </ViewTransition>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

const root = createRoot(document.getElementById("root"), {});
root.render(<App />);
