import { Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Layout({ children }: { children: React.ReactNode }) {
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
