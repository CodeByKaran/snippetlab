import { useState } from "react";
import {
  Code,
  Users,
  PlusSquare,
  UserPlus,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { navBarHeight } from "./data/constant";
import { Link, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "snippets", label: "Snippets", icon: Code },
    { id: "accounts", label: "Accounts", icon: Users },
    { id: "create-snippet", label: "Create Snippet", icon: PlusSquare },
    { id: "add-account", label: "Add Account", icon: UserPlus },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-2">
        <LayoutDashboard className="text-primary" size={24} />
        <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const fullPath = `/admin/dashboard/${item.id}`;
          const isActive = location.pathname === fullPath;

          return (
            <Link
              key={item.id}
              to={fullPath}
              onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex items-start bg-background">
      {/* DESKTOP SIDEBAR */}
      <aside
        style={{
          top: `${navBarHeight}px`,
          height: `calc(100vh - ${navBarHeight}px)`,
        }}
        className="hidden md:block sticky w-64 border-r border-border/50 bg-muted/5 shrink-0"
      >
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR TRIGGER */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full h-12 w-12 shadow-xl border-2 border-primary/20"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* This is where the SnippetsView, AccountsView etc. will render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
