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
import SnippetsView from "./components/dashboard/SnippetsView";
import AccountsView from "./components/dashboard/AccountsView";
import CreateSnippetForm from "./components/dashboard/CreateSnippetForm";
import AddAccountForm from "./components/dashboard/AddAccountForm";
import { navBarHeight } from "./data/constant";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("snippets");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "snippets", label: "Snippets", icon: Code },
    { id: "accounts", label: "Accounts", icon: Users },
    { id: "create-snippet", label: "Create Snippet", icon: PlusSquare },
    { id: "add-account", label: "Add Account", icon: UserPlus },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "snippets":
        return <SnippetsView />;
      case "accounts":
        return <AccountsView />;
      case "create-snippet":
        return <CreateSnippetForm onSuccess={() => setActiveTab("snippets")} />;
      case "add-account":
        return <AddAccountForm onSuccess={() => setActiveTab("accounts")} />;
      default:
        return <SnippetsView />;
    }
  };

  // Pure UI for the Sidebar
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-2">
        <LayoutDashboard className="text-primary" size={24} />
        <h2 className="text-xl font-bold tracking-tight">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    // Ensure the container is aligned to the top and spans full height
    <div className="flex items-start bg-background">
      {/* DESKTOP SIDEBAR: The container is sticky */}
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

      {/* MAIN CONTENT: This part scrolls while the sidebar stays put */}
      <main className="flex-1 p-4 md:p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
