import React, { use, useActionState, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import SearchBar from "./searchbar";
import { CornerDownLeft, Flame, Info, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";

interface searchResult {
  id: string;
  title: string;
}

const sampleSnippets = [
  { id: "1", title: "How to center a div in CSS?" },
  { id: "2", title: "JavaScript array sorting" },
  { id: "3", title: "Python list comprehension" },
  { id: "4", title: "React useEffect hook" },
];

const mostSearchedSnippets = [
  { id: "1", title: "How to center a div in CSS?" },
  { id: "2", title: "JavaScript array sorting" },
  { id: "3", title: "Python list comprehension" },
  { id: "4", title: "React useEffect hook" },
];

const SearchPage = ({ close }: { close: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<searchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If query is empty, reset results and stop
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    console.log(searchQuery);

    const filteredSnippets = sampleSnippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    console.log(filteredSnippets);

    setSearchResults(filteredSnippets.length > 0 ? filteredSnippets : []);
  }, [searchQuery]); // This runs every time searchQuery actually changes

  const handleNavigate = (id: string) => {
    // todo: navigate to snippet page
    close();
    navigate(`/snippet/${id}`);
  };

  return (
    <Card className="w-full h-96 flex items-stretch pt-5 pb-0">
      <CardHeader className="p-0 px-2 relative">
        <Input
          placeholder="Search snippets..."
          className="relative"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />

        <SearchIcon
          size={15}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </CardHeader>
      <CardContent className=" p-0  flex-1 overflow-y-auto px-2 ">
        <div className="w-full flex flex-col items-start space-y-2">
          {searchResults.length > 0 ? (
            searchResults.map((snippet) => (
              <div
                key={snippet.id}
                className="w-full rounded-md p-2 text-sm hover:bg-secondary cursor-pointer flex items-center"
                onClick={() => handleNavigate(snippet.id)}
              >
                <SearchIcon
                  className="inline mr-2 text-muted-foreground"
                  size={15}
                />
                {snippet.title}
              </div>
            ))
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 flex items-center">
              <Info className="mr-2" size={15} />
              No results found for "{searchQuery}"
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-1">
                Trending
              </p>
              {mostSearchedSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="w-full rounded-md p-2 text-sm hover:bg-secondary cursor-pointer flex items-center"
                  onClick={() => handleNavigate(snippet.id)}
                >
                  <Flame className="inline mr-2 text-orange-500" size={15} />
                  {snippet.title}
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="w-full flex items-center p-0 text-xs pl-4 text-muted-foreground  h-15  bg-muted/30 ">
        <span className="mr-2 bg-background  rounded-sm p-1 ">
          <CornerDownLeft size={15} className="" />
        </span>{" "}
        Type your query and press Enter to find relevant snippets!
      </CardFooter>
    </Card>
  );
};

export default SearchPage;
