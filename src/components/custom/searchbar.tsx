import React from "react";
import { Input } from "../ui/input";

interface SearchBarProps {
  // Define any props you want to pass to the SearchBar component
  isReadOnly?: boolean; // Example prop to indicate if the search bar is read-only
  className?: string; // Example prop to allow custom styling
}

const SearchBar = ({ isReadOnly, className }: SearchBarProps) => {
  const hadleClick = () => {
    if (isReadOnly) {
      // If the search bar is read-only, do nothing or show a message
      return;
    }
    // todo
  };

  return (
    <div className={className}>
      <Input
        // placeholder="Search snippets..."
        onClick={hadleClick}
        readOnly={isReadOnly}
        className=""
        value={"Search snippets..."}
      />
    </div>
  );
};

export default SearchBar;
