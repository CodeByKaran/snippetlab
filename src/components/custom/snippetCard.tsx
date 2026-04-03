import React from "react";
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

interface SnippetCardProps {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: string;
  difficulty: string;
  createdBy: string;
}

const SnippetCard = (props: SnippetCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Card className="grid grid-cols-1 grid-rows-[auto_auto_1fr_auto] bg-transparent border border-border backdrop-blur-lg cursor-pointer hover:bg-muted/20 transition-colors duration-300 select-none">
      <CardHeader>{props.title}</CardHeader>
      <CardDescription className="px-4">{props.description}</CardDescription>
      <CardContent>
        <div className="rounded overflow-hidden border border-border p-2">
          <SyntaxHighlighter
            language={props.language} // e.g. "javascript", "typescript", "python"
            // style={isDark ? oneDark : oneLight}
            customStyle={{
              margin: 0,
              borderRadius: "0.375rem",
              fontSize: "0.8rem",
              maxHeight: "150px",
              overflow: "hidden",
              backgroundColor: "transparent !important",

              fontFamily: "var(--font-sans)",
            }}
            style={isDark ? nightOwl : a11yLight}
            wrapLongLines={true}
          >
            {props.code.substring(0, 200) + "..."}
          </SyntaxHighlighter>
        </div>
      </CardContent>
      <CardFooter className="bg-transparent">
        <div className="w-full flex items-center justify-between space-x-4">
          <div className="  flex gap-1 flex-wrap">
            {props.tags.map((tag) => (
              <span
                key={tag}
                className="py-1 px-1 bg-transparent/50 backdrop-blur-3xl border border-border text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col">
            <div>
              <span className="text-xs text-muted-foreground">
                {props.createdBy}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                {props.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SnippetCard;
