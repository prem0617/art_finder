"use client";

import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import axios from "axios";

const NavBar = () => {
  const [user, setUser] = useState();
  const fetchGetMe = async () => {
    try {
      const response = await axios.get("/api/getMe");
      console.log(response);
      if (response.status === 200) {
        setUser(response.data.decodedToken.companyName);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    fetchGetMe();
    console.log(user);
  }, []);

  console.log(user);

  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout Success");
    router.push("/login");
  };

  return (
    <div className="flex justify-between px-20 h-20 shadow-xl items-center">
      <Link href={"/"}>
        <div className="font-bold logo text-3xl">ART FINDER</div>
      </Link>{" "}
      <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger>
            <User className="border rounded-full min-w-10 min-h-10 p-1 cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <p>User info : {user}</p>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant={"destructive"}
          onClick={handleLogout}
          className="text-base"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
