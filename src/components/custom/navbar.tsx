import ThemeToggle from "../theme-toggle";
import { Button } from "../ui/button";
import SearchBar from "./searchbar";

import { Code } from "lucide-react";

import DrawerMenu from "./drawer";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };
  return (
    <nav
      className={`sticky top-0 bg-background rounded-b-lg  w-full z-50 transition-all duration-300 $`}
    >
      <div className="flex justify-between items-center py-4 md:px-9 px-4">
        <div className="flex items-center ">
          <Code size={20} />
          <h3 className="font-heading font-extrabold text-lg bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent ml-1.5">
            Snippet Lab
          </h3>
        </div>
        {/* right part */}
        <div className="space-x-2 items-center hidden md:flex">
          <ThemeToggle />
          <SearchBar isReadOnly={true} className="" />
          <Button variant="default" onClick={handleAdminLogin}>
            Admin Login
          </Button>
        </div>
        <DrawerMenu />

        {/* end of parent div */}
      </div>
    </nav>
  );
};

export default NavBar;
