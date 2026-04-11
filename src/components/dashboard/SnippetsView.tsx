import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "../../utils/supabase";
import { Trash2, Edit3, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import EditSnippetDialog from "./EditSnippetDialog";

const PAGE_SIZE = 6;

const parsePostgresArray = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags; // If already an array, return it
  if (typeof tags !== "string") return [];

  return tags
    .replace(/[{}]/g, "") // Remove curly braces
    .split(",") // Split by comma
    .map((tag) => tag.trim().replace(/^"|"$/g, "")) // Remove outer quotes and trim
    .filter(Boolean); // Remove empty strings
};

const SnippetsView = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<any>(null);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();

  // 1. Infinite Query Fetcher
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["admin-snippets"],
      queryFn: async ({ pageParam = 0 }) => {
        const { data, count, error } = await supabase
          .from("snippets")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(pageParam, pageParam + PAGE_SIZE - 1);

        if (error) throw error;
        return { data, nextCursor: pageParam + PAGE_SIZE, total: count };
      },
      getNextPageParam: (lastPage) =>
        lastPage.data.length === PAGE_SIZE ? lastPage.nextCursor : undefined,
      initialPageParam: 0,
    });

  // 2. Trigger next page load when scrolled to bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("snippets").delete().eq("id", id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-snippets"] }),
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  const allSnippets = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.total || 0;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border bg-card shadow-sm inline-block min-w-[200px]">
        <p className="text-sm text-muted-foreground font-medium">
          Total Snippets
        </p>
        <h3 className="text-3xl font-bold">{totalCount}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {allSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className="border rounded-xl bg-card overflow-hidden transition-all"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
              onClick={() =>
                setExpandedId(expandedId === snippet.id ? null : snippet.id)
              }
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                  {snippet.language?.substring(0, 3).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{snippet.title}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {snippet.category || "General"}
                  </span>
                </div>
              </div>
              {expandedId === snippet.id ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </div>

            {expandedId === snippet.id && (
              <div className="p-4 pt-0 border-t border-border/50 bg-muted/5 animate-in fade-in slide-in-from-top-2">
                {/* Inside the expanded snippet view */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {parsePostgresArray(snippet.tags).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full border border-border/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <pre className="mt-4 p-4 rounded-lg bg-zinc-950 text-zinc-100 text-xs overflow-x-auto max-h-60 scrollbar-thin overflow-y-auto">
                  <code>{snippet.code}</code>
                </pre>
                <div className="mt-4 flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSnippet(snippet);
                    }}
                  >
                    <Edit3 size={14} /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(snippet.id);
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Infinite Scroll Trigger */}
        <div ref={ref} className="py-8 flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="animate-spin text-muted-foreground" />
          ) : hasNextPage ? (
            <span className="text-xs text-muted-foreground">Load more...</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              No more snippets.
            </span>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSnippet && (
        <EditSnippetDialog
          snippet={editingSnippet}
          open={!!editingSnippet}
          onOpenChange={(open: any) => !open && setEditingSnippet(null)}
        />
      )}
    </div>
  );
};

export default SnippetsView;
