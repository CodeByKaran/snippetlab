import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, Flame, Info, CornerDownLeft, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { getTrendingSnippets, searchSnippets } from "@/apis/snippet-apis";

const SearchPage = ({ close }: { close: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Query 1: Fetch Trending (runs on mount)
  const { data: trending = [], isLoading: loadingTrending } = useQuery({
    queryKey: ["snippets", "trending"],
    queryFn: getTrendingSnippets,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Query 2: Fetch Search Results (runs when searchQuery changes)
  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: ["snippets", "search", searchQuery],
    queryFn: () => searchSnippets(searchQuery),
    enabled: searchQuery.trim().length > 0, // Only run if there's text
  });

  const handleNavigate = (id: string) => {
    close();
    navigate(`/snippet/${id}`);
  };

  const isNoResults =
    searchQuery.trim() !== "" && searchResults.length === 0 && !isSearching;

  return (
    <div className="flex flex-col h-[450px] w-full bg-background overflow-hidden">
      {/* Header / Input Area */}
      <div className="flex items-center px-4 border-b border-border/50">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          autoFocus
        />
        {isSearching && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="space-y-1">
          {searchQuery.trim() === "" ? (
            /* TRENDING VIEW */
            <>
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Trending Snippets
              </p>
              {loadingTrending ? (
                <div className="p-4 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-border" />
                </div>
              ) : (
                trending.map((snippet) => (
                  <SearchItem
                    key={snippet.id}
                    title={snippet.title}
                    icon={<Flame size={14} className="text-orange-500" />}
                    onClick={() => handleNavigate(snippet.id)}
                  />
                ))
              )}
            </>
          ) : isNoResults ? (
            /* NO RESULTS VIEW */
            <div className="py-14 text-center">
              <Info className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No snippets found for{" "}
                <span className="font-semibold text-foreground">
                  "{searchQuery}"
                </span>
              </p>
            </div>
          ) : (
            /* SEARCH RESULTS VIEW */
            <>
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Snippets ({searchResults.length})
              </p>
              {searchResults.map((snippet) => (
                <SearchItem
                  key={snippet.id}
                  title={snippet.title}
                  icon={<Search size={14} className="text-muted-foreground" />}
                  onClick={() => handleNavigate(snippet.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Footer / Shortcut Info */}
      <div className="flex items-center gap-4 border-t border-border/40 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] border border-border/50">
            <CornerDownLeft size={10} className="inline mr-1" />
            Enter
          </kbd>
          <span>to select</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] border border-border/50">
            Esc
          </kbd>
          <span>to close</span>
        </div>
      </div>
    </div>
  );
};

// Reusable item component for cleaner code
const SearchItem = ({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-secondary group text-left"
  >
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-background group-hover:border-primary/20 transition-colors">
      {icon}
    </div>
    <span className="truncate font-medium text-foreground/80 group-hover:text-foreground">
      {title}
    </span>
  </button>
);

export default SearchPage;
