import React from "react";
import SnippetCard from "./components/custom/snippetCard";
import { snippets } from "./data/sample";

const Home = () => {
  return (
    <div className="px-4 py-12 sm:p-12 mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 ">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          id={snippet.id}
          title={snippet.title}
          description={snippet.description}
          code={snippet.code}
          language={snippet.language}
          tags={snippet.tags}
          createdAt={snippet.createdAt}
          updatedAt={snippet.updatedAt}
          category={snippet.category}
          difficulty={snippet.difficulty}
          createdBy={snippet.createdBy}
        />
      ))}
    </div>
  );
};

export default Home;
