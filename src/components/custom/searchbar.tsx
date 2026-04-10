import { useState } from "react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import SearchPage from "./searchPage";

interface SearchBarProps {
  // Define any props you want to pass to the SearchBar component
  isReadOnly?: boolean; // Example prop to indicate if the search bar is read-only
  className?: string; // Example prop to allow custom styling
}

const SearchBar = ({ isReadOnly, className }: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hadleClick = () => {
    if (isReadOnly) {
      // If the search bar is read-only, do nothing or show a message
      return;
    }
    // todo
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog key={"search-dialog"} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={className}>
          <Input
            placeholder="Search snippets..."
            onClick={hadleClick}
            readOnly={isReadOnly}
            className=""
          />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-blue-400 p-0" showCloseButton={false}>
        <SearchPage close={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
