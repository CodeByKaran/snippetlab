import { useEffect, useState } from "react";
import { Equal, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import SearchBar from "./searchbar";
import ThemeToggle from "../theme-toggle";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import type { Session } from "@supabase/supabase-js";

const DrawerMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false); // Close drawer after navigation
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/");
  };
  const userEmail = session?.user?.email;
  const firstLetter = userEmail?.charAt(0).toUpperCase();

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Equal />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-sm font-medium text-muted-foreground">
              Menu
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col space-y-4 items-center px-6 pb-8 pt-2">
            <div className="flex w-full space-x-2">
              <div className="flex-1">
                <SearchBar isReadOnly={true} className="w-full" />
              </div>
              <ThemeToggle />
            </div>

            <div className="w-full border-t border-border/50 my-2" />

            {session ? (
              <div className="w-full space-y-3 mt-2">
                <Button
                  variant={isDashboard ? "secondary" : "outline"}
                  className="w-full justify-start gap-3 h-11"
                  onClick={() =>
                    !isDashboard
                      ? handleNavigation("/admin/dashboard")
                      : setOpen(false)
                  }
                >
                  <LayoutDashboard
                    size={18}
                    className={isDashboard ? "text-primary" : ""}
                  />
                  Dashboard
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Logout
                </Button>

                {/* Profile Section - Mobile Side-by-Side */}
                <div className="pt-6 mt-2 w-full border-t border-border/20">
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted/30 shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">
                        {firstLetter}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/50">
                        Administrator
                      </p>
                      <p className="text-sm text-muted-foreground truncate italic">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                variant="default"
                className="w-full h-11 gap-2"
                onClick={() => handleNavigation("/admin-login")}
              >
                <ShieldCheck size={18} />
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerMenu;
