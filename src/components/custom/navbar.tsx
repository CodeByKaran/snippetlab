import { useEffect, useState } from "react";
import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import SearchBar from "./searchbar";
import { Code, LayoutDashboard, LogOut } from "lucide-react";
import DrawerMenu from "./drawer";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import type { Session } from "@supabase/supabase-js";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);

  const isDashboard = location.pathname.startsWith("/admin/dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const userEmail = session?.user?.email;
  const firstLetter = userEmail?.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 bg-background border-b border-border/40 w-full z-50 transition-all duration-300 min-h-[76px] h-[76px]">
      <div className="relative flex justify-between items-center py-4 md:px-9 px-4  min-h-[76px] h-[76px]">
        {/* LEFT: Logo */}
        <div
          className="flex items-center cursor-pointer z-10 "
          onClick={() => navigate("/")}
        >
          <Code size={20} />
          <h3 className="font-heading font-extrabold text-lg bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent ml-1.5">
            Snippet Lab
          </h3>
        </div>

        {/* MIDDLE: Search and Dashboard (Only when session is active) */}
        {session && (
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4 w-auto">
            <SearchBar isReadOnly={true} className="w-76 max-[1100px]:w-64" />
          </div>
        )}

        {/* RIGHT: User Controls */}
        <div className="flex items-center space-x-2 z-10">
          {session ? (
            <div className="hidden lg:flex items-center gap-3">
              {/* Grouped: Toggle and Avatar */}
              <div className="flex items-center gap-2 p-1">
                <Button
                  variant={isDashboard ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => !isDashboard && navigate("/admin/dashboard")}
                  className="flex items-center gap-2 h-9"
                >
                  <LayoutDashboard size={15} />
                  <span className="text-xs">Dashboard</span>
                </Button>
                <ThemeToggle />
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-background border border-border shadow-sm"
                  title={userEmail}
                >
                  <span className="text-[11px] font-bold text-foreground">
                    {firstLetter}
                  </span>
                </div>
              </div>

              {/* Separate: Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 h-9 text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            // Layout when NOT logged in (Desktop)
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <SearchBar isReadOnly={true} />
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/admin-login")}
              >
                Admin Login
              </Button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <DrawerMenu />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
