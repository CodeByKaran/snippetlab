import { Equal } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import SearchBar from "./searchbar";
import ThemeToggle from "../theme-toggle";
import { useNavigate } from "react-router-dom";

const DrawerMenu = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };
  return (
    <Drawer key={"drawer"} direction={"bottom"}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden  ">
          <Equal />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full flex flex-col space-y-4 items-center  py-8">
          <div className="flex space-x-2">
            <SearchBar isReadOnly={true} className="" />
            <ThemeToggle />
          </div>

          <Button
            variant="default"
            className="w-full max-w-69.25 mx-auto"
            onClick={handleAdminLogin}
          >
            Admin Login
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerMenu;
