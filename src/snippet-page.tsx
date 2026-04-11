import React, { useState, useMemo } from "react";
import { useParams } from "react-router";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yLight,
  nightOwl,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "./components/theme-provider";
import { Copy, Check, Calendar, User, ChevronLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOneSnippet } from "./apis/snippet-apis";
import { useNavigate } from "react-router-dom";

const SnippetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [copied, setCopied] = useState(false);

  const {
    data: snippet,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["snippet", id],
    queryFn: () => getOneSnippet(id!),
    enabled: !!id,
    // OPTIMIZATION: Check if this snippet already exists in the "snippets" list cache
    initialData: () => {
      const infiniteData = queryClient.getQueryData<{ pages: any[] }>([
        "snippets",
      ]);
      const allSnippets = infiniteData?.pages.flatMap((page) => page.snippets);
      return allSnippets?.find((s) => s.id === id);
    },
    staleTime: 1000 * 60 * 1, // 5 minutes
  });

  const handleCopyClick = () => {
    if (!snippet?.code) return;
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format tags string "{react, node}" -> ["react", "node"]
  const formattedTags = useMemo(() => {
    if (!snippet?.tags) return [];
    if (Array.isArray(snippet.tags)) return snippet.tags;
    return snippet.tags
      .replace(/[{}]/g, "")
      .split(",")
      .map((t: string) => t.trim());
  }, [snippet?.tags]);

  if (isLoading) return <div className="p-20 text-center">Loading...</div>;
  if (isError || !snippet)
    return <div className="p-20 text-center">Snippet not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] min-h-screen">
      <div className="px-4 pl-4 md:pl-12 flex flex-col gap-6 items-start md:py-12 py-9 max-w-[1000px] bg-background md:border-r border-border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft size={16} /> Back to Snippets
        </button>

        <div className="space-y-2 w-full">
          <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold tracking-tight leading-tight">
            {snippet.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {snippet.description}
          </p>
        </div>

        <div className="rounded-xl border border-border w-full relative group overflow-hidden bg-muted/20">
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md shadow-lg hover:opacity-90 transition-all active:scale-95"
              onClick={handleCopyClick}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span className="text-xs font-medium">
                {copied ? "Copied!" : "Copy Code"}
              </span>
            </button>
          </div>

          <SyntaxHighlighter
            language={snippet.language}
            style={isDark ? nightOwl : a11yLight}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              fontSize: "0.9rem",
              background: "transparent", // Fixed: removed !important
              fontFamily: "var(--font-mono)",
              lineHeight: "1.6",
            }}
            showLineNumbers={true}
            wrapLongLines={true}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Optimized Sidebar */}
      <aside className="lg:sticky lg:top-[78px] lg:h-screen lg:max-h-[calc(100vh-78px)] p-6 lg:p-8 space-y-8  bg-background min-[767px]:pl-15">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Details
          </h3>
          <div className="space-y-4">
            <DetailItem
              icon={<User size={16} />}
              label="Created by"
              value={snippet.createdBy}
            />
            <DetailItem
              icon={<Calendar size={16} />}
              label="Category"
              value={snippet.category}
            />
            <DetailItem
              icon={
                <div
                  className={`w-2 h-2 rounded-full ${snippet.difficulty === "Hard" ? "bg-red-500" : "bg-green-500"}`}
                />
              }
              label="Difficulty"
              value={snippet.difficulty}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {formattedTags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-background border border-border text-foreground/80 text-xs rounded-full hover:border-primary/50 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

// Helper Component for Sidebar Items
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="text-muted-foreground">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
);

export default SnippetPage;
