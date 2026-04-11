import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Search } from "lucide-react"; // Import Search icon
import SearchPage from "./searchPage";
import { cn } from "@/lib/utils"; // Shadcn utility for classes

interface SearchBarProps {
  isReadOnly?: boolean;
  className?: string;
}

const SearchBar = ({ isReadOnly, className }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut listener (⌘K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <Dialog key={"search-dialog"} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={cn("relative group cursor-pointer", className)}>
          {/* Search Icon */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />

          <Input
            placeholder="Search snippets..."
            readOnly={isReadOnly} // Always readOnly because it's a trigger
            className="pl-9 pr-12 h-9 w-full bg-muted/40 border-border/50 hover:bg-muted/60 hover:border-border transition-all cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Keyboard Shortcut Hint */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none select-none rounded border border-border bg-background px-1.5 py-0.5 h-fit font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:bg-muted transition-colors">
            <span className="text-[8.5px]">⌘</span>K
          </div>
        </div>
      </DialogTrigger>

      <DialogContent
        className="p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <SearchPage close={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
