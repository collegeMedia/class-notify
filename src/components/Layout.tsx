
import { ReactNode } from "react";
import Header from "./Header";
import { currentUser } from "@/lib/data";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-blue-50/30">
      <Header user={currentUser} />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
