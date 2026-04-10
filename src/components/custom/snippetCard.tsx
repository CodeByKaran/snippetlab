import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import SyntaxHighlighter from "react-syntax-highlighter";
import { useTheme } from "../theme-provider";

import {
  a11yLight,
  nightOwl,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useNavigate } from "react-router-dom";

interface SnippetCardProps {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string;
  created_at: Date;
  updated_at: Date;
  category: string;
  difficulty: string;
  createdBy: string;
}

const SnippetCard = (props: SnippetCardProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleClick = () => navigate(`/snippet/${props.id}`);

  // Memoize tags so they aren't re-processed on every scroll/render
  const formattedTags = useMemo(() => {
    return props.tags
      .replace(/[{}]/g, "")
      .split(",")
      .map((tag) => tag.trim());
  }, [props.tags]);

  // Memoize time calculation
  const timeAgoText = useMemo(() => {
    const now = new Date();
    const past = new Date(props.created_at);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (isNaN(past.getTime())) return "invalid date";

    const intervals: Record<string, number> = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const counter = Math.floor(seconds / secondsInUnit);
      if (counter >= 1) {
        return `${counter} ${unit}${counter === 1 ? "" : "s"} ago`;
      }
    }
    return "just now";
  }, [props.created_at]);

  return (
    <Card
      className="grid grid-cols-1 grid-rows-[auto_auto_1fr_auto] bg-transparent border border-border backdrop-blur-lg cursor-pointer hover:bg-muted/10 transition-colors duration-300 select-none rounded-md"
      onClick={handleClick}
    >
      <CardHeader className="font-semibold">{props.title}</CardHeader>
      <CardDescription className="px-6 pb-2">
        {props.description}
      </CardDescription>
      <CardContent>
        <div className="rounded overflow-hidden border border-border bg-transparent">
          <SyntaxHighlighter
            language={props.language}
            style={isDark ? nightOwl : a11yLight}
            customStyle={{
              margin: 0,
              padding: "1rem",
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              maxHeight: "150px",
              overflow: "hidden",
              // FIX: Use 'background' instead of 'backgroundColor'
              // and remove '!important'
              background: "transparent",
              fontFamily: "var(--font-sans)",
            }}
            wrapLongLines={true}
          >
            {props.code.length > 200
              ? props.code.substring(0, 200) + "..."
              : props.code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex gap-1 flex-wrap">
            {formattedTags.map((tag) => (
              <span
                key={tag}
                className="py-0.5 px-2 bg-secondary text-[10px] border border-border rounded text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col text-right shrink-0">
            <span className="text-[10px] font-medium text-foreground/70">
              {props.createdBy}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {timeAgoText}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default React.memo(SnippetCard);
